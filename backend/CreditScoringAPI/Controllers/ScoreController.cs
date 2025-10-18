using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Net.Http.Json;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]
public class ScoreController : ControllerBase
{
    private readonly IMongoCollection<BsonDocument> _col;
    private readonly IHttpClientFactory _http;
    private static string[]? _expected;                // кеш списка фич
    private static readonly Dictionary<string, Dictionary<string, int>> _catMaps = new(); // кеш кодировок строк

    public ScoreController(IMongoCollection<BsonDocument> col, IHttpClientFactory http)
    {
        _col = col; _http = http;
    }

    [HttpPost("{iin}")]
    public async Task<IActionResult> ScoreByIin(string iin, [FromQuery] double? creditAmount)
    {
        var ml = _http.CreateClient("ml");

        // 1) Подтянуть список ожидаемых фич (кеш)
        if (_expected == null)
        {
            var meta = await ml.GetFromJsonAsync<ModelFeatures>("/model/features");
            _expected = meta?.expected_features ?? Array.Empty<string>();
            if (_expected.Length == 0)
                return StatusCode(503, new { message = "ML features unavailable" });
        }

        // 2) Достать клиента
        var cleaned = new string(iin.Where(char.IsDigit).ToArray());
        if (string.IsNullOrEmpty(cleaned) || !long.TryParse(cleaned, out var key))
            return BadRequest(new { message = "Некорректный идентификатор" });

        var f = Builders<BsonDocument>.Filter;
        var filter = f.Or(
            f.Eq("SK_ID_CURR", (int)key),
            f.Eq("SK_ID_CURR", (long)key),
            f.Eq("SK_ID_CURR", Convert.ToDouble(key))
        );
        var doc = await _col.Find(filter).FirstOrDefaultAsync();
        if (doc is null) return NotFound(new { message = "Клиент не найден." });

        // 3) BSON -> сырое Dictionary<string, object>
        var raw = new Dictionary<string, object>();
        foreach (var el in doc.Elements)
        {
            if (el.Name is "_id" or "TARGET" or "SK_ID_CURR") continue; // выкидываем служебные
            var v = el.Value;
            if (v.IsNumeric) raw[el.Name] = v.ToDouble();
            else if (v.IsBoolean) raw[el.Name] = v.ToBoolean() ? 1d : 0d;
            else if (v.IsString) raw[el.Name] = v.AsString;
            else raw[el.Name] = v.ToString() ?? "";
        }

        // Если юзер ввёл сумму — перезапишем
        if (creditAmount.HasValue) raw["AMT_CREDIT"] = creditAmount.Value;

        // Производные (как в тренировке)
        double GetD(string n) => raw.TryGetValue(n, out var o) && o is double d ? d : 0d;
        double fam = GetD("CNT_FAM_MEMBERS"); if (fam <= 0) fam = 1;
        raw["AMT_CREDIT_PER_PERSON"] = fam == 0 ? 0 : GetD("AMT_CREDIT") / fam;
        raw["AMT_INCOME_TOTAL_PER_PERSON"] = fam == 0 ? 0 : GetD("AMT_INCOME_TOTAL") / fam;
        raw["AMT_ANNUITY_PER_PERSON"] = fam == 0 ? 0 : GetD("AMT_ANNUITY") / fam;

        // 4) Сборка payload РОВНО по списку expected_features
        var feats = new Dictionary<string, object>(_expected.Length);
        foreach (var name in _expected)
        {
            if (!raw.TryGetValue(name, out var val) || val is null)
            {
                feats[name] = null!;
                continue;
            }

            switch (val)
            {
                case double d: feats[name] = d; break;
                case int i: feats[name] = (double)i; break;
                case long l: feats[name] = (double)l; break;
                case bool b: feats[name] = b ? 1d : 0d; break;
                case string s:
                    // Временная ordinal-кодировка строк (если в pkl нет энкодера)
                    // Стабильная в рамках процесса (кеш в _catMaps)
                    var map = _catMaps.GetValueOrDefault(name);
                    if (map is null)
                    {
                        map = new Dictionary<string, int>(StringComparer.Ordinal);
                        _catMaps[name] = map;
                    }
                    if (!map.TryGetValue(s, out var code))
                    {
                        code = map.Count + 1; // 1..N, 0 зарезервируем под MISSING
                        map[s] = code;
                    }
                    feats[name] = (double)code;
                    break;
                default:
                    feats[name] = null!;
                    break;
            }
        }

        var payload = new { features = feats };
        var resp = await ml.PostAsJsonAsync("/predict", payload);
        if (!resp.IsSuccessStatusCode)
        {
            var err = await resp.Content.ReadAsStringAsync();
            return StatusCode((int)resp.StatusCode, new { message = "ML error", detail = err });
        }
        var data = await resp.Content.ReadFromJsonAsync<ScoreResult>();
        return Ok(data);
    }

    private class ModelFeatures { public string[]? expected_features { get; set; } }
    private class ScoreResult { public double probability { get; set; } public string decision { get; set; } = ""; public double threshold { get; set; } }
}

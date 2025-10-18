using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Net.Http.Json;

[ApiController]
[Route("api/[controller]")]
public class ScoreController : ControllerBase
{
    private readonly IMongoCollection<BsonDocument> _col;
    private readonly IHttpClientFactory _http;

    public ScoreController(IMongoCollection<BsonDocument> col, IHttpClientFactory http)
    {
        _col = col;
        _http = http;
    }

    // POST /api/score/{iin}?creditAmount=123456
    [HttpPost("{iin}")]
    public async Task<IActionResult> ScoreByIin(string iin, [FromQuery] double? creditAmount)
    {
        var cleaned = new string(iin.Where(char.IsDigit).ToArray());
        if (string.IsNullOrEmpty(cleaned) || !long.TryParse(cleaned, out var key))
            return BadRequest(new { message = "Некорректный ИИН." });

        // 1) достаём клиента
        var f = Builders<BsonDocument>.Filter;
        var filter = f.Or(
            f.Eq("SK_ID_CURR", (int)key),
            f.Eq("SK_ID_CURR", (long)key),
            f.Eq("SK_ID_CURR", Convert.ToDouble(key))
        );
        var doc = await _col.Find(filter).FirstOrDefaultAsync();
        if (doc is null) return NotFound(new { message = "Клиент не найден." });

        var ml = _http.CreateClient("ml");

        // 2) запрашиваем список фич (совместим с /model/features)
        List<string>? featuresList = null;
        try
        {
            var meta = await ml.GetFromJsonAsync<FeaturesDto>("/model/features");
            featuresList = meta?.features;
        }
        catch
        {
            // fallback на /features, если кто-то убрал alias
            var meta = await ml.GetFromJsonAsync<FeaturesDto>("/features");
            featuresList = meta?.features;
        }

        if (featuresList is null || featuresList.Count == 0)
            return StatusCode(503, new { message = "Сервис скоринга недоступен (нет списка фич)." });

        // 3) строим словарь значений (string->double) по именам фич
        var payloadFeatures = new Dictionary<string, object>(featuresList.Count);
        foreach (var name in featuresList)
        {
            // ищем поле (регистр учитываем как в исходном датасете)
            if (doc.TryGetValue(name, out var val) && !val.IsBsonNull)
            {
                payloadFeatures[name] = TryToDouble(val);
            }
            else
            {
                payloadFeatures[name] = 0.0; // дефолт
            }
        }

        // 4) формируем тело запроса к ML
        var body = new PredictIn
        {
            features = payloadFeatures,
            creditAmount = creditAmount
        };

        // 5) запрашиваем ML
        var resp = await ml.PostAsJsonAsync("/predict", body);
        if (!resp.IsSuccessStatusCode)
        {
            var text = await resp.Content.ReadAsStringAsync();
            return StatusCode(503, new { message = "Сервис скоринга недоступен.", detail = text });
        }

        var result = await resp.Content.ReadFromJsonAsync<PredictOut>();
        return Ok(result);
    }

    private static double TryToDouble(BsonValue v)
    {
        // максимально лояльная конвертация
        return v.IsInt32 ? v.AsInt32 :
               v.IsInt64 ? v.AsInt64 :
               v.IsDouble ? v.AsDouble :
               v.IsString && double.TryParse(v.AsString, out var d) ? d : 0.0;
    }

    private class FeaturesDto { public List<string> features { get; set; } = new(); }
    private class PredictIn
    {
        public Dictionary<string, object> features { get; set; } = new();
        public double? creditAmount { get; set; }
    }
    private class PredictOut
    {
        public double probability { get; set; }
        public string decision { get; set; } = "";
        public double threshold { get; set; }
    }
}

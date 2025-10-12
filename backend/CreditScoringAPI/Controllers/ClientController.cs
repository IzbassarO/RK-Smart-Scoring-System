using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

[ApiController]
[Route("api/[controller]")]
public class ClientController : ControllerBase
{
    private readonly IMongoCollection<BsonDocument> _col;
    public ClientController(IMongoCollection<BsonDocument> col) => _col = col;

    // GET /api/client/{iin}
    [HttpGet("{iin}")]
    public async Task<IActionResult> GetByIin(string iin)
    {
        // оставляем только цифры, не требуем длину
        var cleaned = new string(iin.Where(char.IsDigit).ToArray());
        if (string.IsNullOrEmpty(cleaned) || !long.TryParse(cleaned, out var key))
            return NotFound(new { message = "Клиент не найден." });

        var f = Builders<BsonDocument>.Filter;
        var filter = f.Or(
            f.Eq("SK_ID_CURR", (int)key),                 // int32
            f.Eq("SK_ID_CURR", (long)key),                // int64
            f.Eq("SK_ID_CURR", Convert.ToDouble(key))     // double
        );
        var doc = await _col.Find(filter).FirstOrDefaultAsync();
        
        if (doc is null)
            return NotFound(new { message = "Клиент не найден." });

        var dto = ToClientDto(doc);
        return Ok(dto);
    }

    private static ClientDto ToClientDto(BsonDocument d)
    {
        string S(string n) => d.TryGetValue(n, out var v) && v.IsString ? v.AsString : string.Empty;
        int I(string n) => d.TryGetValue(n, out var v) && v.IsNumeric ? (int)v.ToInt64() : 0;
        long L(string n) => d.TryGetValue(n, out var v) && v.IsNumeric ? v.ToInt64() : 0L;
        double D(string n) => d.TryGetValue(n, out var v) && v.IsNumeric ? v.ToDouble() : 0d;
        int Age(int daysBirth) => daysBirth == 0 ? 0 : Math.Max(0, (int)Math.Round(Math.Abs(daysBirth) / 365.25));

        var daysBirth = I("DAYS_BIRTH");

        return new ClientDto
        {
            SkIdCurr = L("SK_ID_CURR"),
            Age = Age(daysBirth),
            Gender = S("CODE_GENDER"),
            FamilyStatus = S("NAME_FAMILY_STATUS"),
            HousingType = S("NAME_HOUSING_TYPE"),
            Employment = S("NAME_INCOME_TYPE"),
            Education = S("NAME_EDUCATION_TYPE"),
            Occupation = S("OCCUPATION_TYPE"),
            Children = I("CNT_CHILDREN"),
            FamilyMembers = I("CNT_FAM_MEMBERS"),
            IncomeAnnual = D("AMT_INCOME_TOTAL"),
            CreditAmount = D("AMT_CREDIT"),
            Annuity = D("AMT_ANNUITY"),
            GoodsPrice = D("AMT_GOODS_PRICE"),
            ExtSource1 = D("EXT_SOURCE_1"),
            ExtSource2 = D("EXT_SOURCE_2"),
            ExtSource3 = D("EXT_SOURCE_3"),
            RegionRatingClient = I("REGION_RATING_CLIENT"),
            RegionRatingClientWCity = I("REGION_RATING_CLIENT_W_CITY"),
        };
    }
}

public class ClientDto
{
    public long SkIdCurr { get; set; }

    // профиль
    public int Age { get; set; }
    public string Gender { get; set; } = "";
    public string FamilyStatus { get; set; } = "";
    public string HousingType { get; set; } = "";
    public string Employment { get; set; } = "";
    public string Education { get; set; } = "";
    public string Occupation { get; set; } = "";
    public int Children { get; set; }
    public int FamilyMembers { get; set; }

    // финансы
    public double IncomeAnnual { get; set; }
    public double CreditAmount { get; set; }
    public double Annuity { get; set; }
    public double GoodsPrice { get; set; }

    // риск-контекст
    public double ExtSource1 { get; set; }
    public double ExtSource2 { get; set; }
    public double ExtSource3 { get; set; }
    public int RegionRatingClient { get; set; }
    public int RegionRatingClientWCity { get; set; }
}

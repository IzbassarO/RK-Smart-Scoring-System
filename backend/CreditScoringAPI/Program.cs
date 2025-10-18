using MongoDB.Bson;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// === MONGO: безопасные дефолты + понятная диагностика ===
var mongoConn = builder.Configuration["MongoConn"]
               ?? Environment.GetEnvironmentVariable("MONGO_CONN")
               ?? "mongodb://localhost:27017";   // дефолт для локалки

var mongoDbName = builder.Configuration["MongoDbName"] ?? "bank";
var mongoCol    = builder.Configuration["MongoCollection"] ?? "bank";

builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoConn));
builder.Services.AddSingleton(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    var db = client.GetDatabase(mongoDbName);
    return db.GetCollection<BsonDocument>(mongoCol);
});

// CORS: Dev — всё разрешаем; в проде ограничь доменами фронта
builder.Services.AddCors(p => p.AddPolicy("AllowDev",
    b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// === ML HttpClient (не валит старт, если ML не поднят) ===
builder.Services.AddHttpClient("ml", c =>
{
    c.BaseAddress = new Uri(Environment.GetEnvironmentVariable("ML_BASE_URL") ?? "http://localhost:9000");
    c.Timeout = TimeSpan.FromSeconds(5);
});

var app = builder.Build();

app.UseCors("AllowDev");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

// === Healthcheck с ловлей ошибок Mongo ===
app.MapGet("/api/health", async (IMongoCollection<BsonDocument> col) =>
{
    try
    {
        await col.Find(new BsonDocument()).Limit(1).FirstOrDefaultAsync();
        return Results.Ok(new { status = "ok", mongo = "ok" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"mongo_error: {ex.Message}");
    }
});

app.Run();

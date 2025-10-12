using MongoDB.Bson;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Mongo (singleton)
builder.Services.AddSingleton<IMongoClient>(_ =>
    new MongoClient(builder.Configuration["MongoConn"]));
builder.Services.AddSingleton(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    var db = client.GetDatabase(builder.Configuration["MongoDbName"] ?? "bank");
    var colName = builder.Configuration["MongoCollection"] ?? "bank";
    return db.GetCollection<BsonDocument>(colName);
});

// CORS: в Dev можно AllowAnyOrigin; в проде — укажи домены фронта
builder.Services.AddCors(p => p.AddPolicy("AllowDev",
    b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowDev");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

// простой healthcheck
app.MapGet("/api/health", async (IMongoCollection<BsonDocument> col) =>
{
    await col.Find(new BsonDocument()).Limit(1).FirstOrDefaultAsync();
    return Results.Ok(new { status = "ok" });
});

app.Run();

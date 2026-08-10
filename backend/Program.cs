using backend.Settings;
using backend.Services;
var builder = WebApplication.CreateBuilder(args);
 builder.Services.Configure<MongoDbSettings>
 (
    builder.Configuration.GetSection("MongoDbSettings")
 );
// Add services to the container.

builder.Services.AddControllers();// this will contain our rest apis endpoints
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSingleton<TodoService>();
builder.Services.AddOpenApi();

var app = builder.Build(); // build the app with all those specification 

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run(); // starts the web server

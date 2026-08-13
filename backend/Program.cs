using backend.Settings;
using backend.Services;
using backend.Exceptions;
using backend.Converters;
var builder = WebApplication.CreateBuilder(args);

// Render (and most PaaS hosts) assign the listen port at runtime via $PORT.
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

 builder.Services.Configure<MongoDbSettings>
 (
    builder.Configuration.GetSection("MongoDbSettings")
 );
// Add services to the container.
builder.Services.AddSwaggerGen();
// this will contain our rest apis endpoints
// the converter makes Mongo's ObjectId travel over JSON as a plain hex string,
// so the Next.js client can send it back on GET/PUT/DELETE /api/todo/{id}
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new ObjectIdJsonConverter());
    });
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSingleton<TodoService>();
builder.Services.AddProblemDetails();
// Comma-separated list, e.g. "https://your-app.vercel.app,http://localhost:3000".
// Falls back to the local Next.js dev origin so `dotnet run` keeps working untouched.
var allowedOrigins = builder.Configuration["AllowedOrigins"]
    ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? ["http://localhost:3000"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy
        .WithOrigins(allowedOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});


var app = builder.Build(); // build the app with all those specification 

app.UseExceptionHandler();
app.UseCors("NextJsPolicy");
if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure the HTTP request pipeline.

// Render terminates TLS at its edge and forwards plain HTTP to the container,
// so redirecting here would loop; only enforce HTTPS locally.
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run(); // starts the web server

using backend.Settings;
using backend.Services;
using backend.Exceptions;
var builder = WebApplication.CreateBuilder(args);
 builder.Services.Configure<MongoDbSettings>
 (
    builder.Configuration.GetSection("MongoDbSettings")
 );
// Add services to the container.
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();// this will contain our rest apis endpoints
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSingleton<TodoService>();
builder.Services.AddProblemDetails();
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy
        .WithOrigins("http://localhost:3000")
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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run(); // starts the web server

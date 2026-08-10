namespace backend.Models;

public class Todo
{
    public int ID{get; set;}
    public string Title{ get; set;}= string.Empty;
    public string? Description{get;set;}
    public bool isCompleted{get;set;}
    public DateTime CreatedAt{get;set;}
}
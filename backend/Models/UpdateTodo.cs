using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace backend.Models;

public class Updatetodo
{
    [Required]
    [StringLength(500)]
    public string title{get;set;}= string.Empty;
    [StringLength(500)]
    public string? description{get; set;}
    public bool IsCompleted{get;set;}
}
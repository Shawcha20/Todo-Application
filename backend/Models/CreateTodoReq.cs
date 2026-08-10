using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace backend.Models;

public class CreateTodoReq
{
    [Required]
    [StringLength(100)]
    public string title{get;set;}=string.Empty;
    [StringLength(500)]
    public string? description{get;set;}
}
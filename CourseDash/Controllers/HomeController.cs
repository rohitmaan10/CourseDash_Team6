using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using CourseDash.Models;

namespace CourseDash.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }
      public IActionResult About()
    {
        return View();
    }
        public IActionResult Read()
    {
        return View();
    }
    public IActionResult Charts()
    {
        return View();
    }

     public IActionResult SatForm()
    {
        return View();  // Return the view for SAT Form
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}

using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using aspnetCoreReactTemplate.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System;
using System.Security.Claims;
using aspnetCoreReactTemplate.BL;
using Microsoft.AspNetCore.Identity;
using api.BL;
using api.Models;

namespace aspnetCoreReactTemplate.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  public class ImportListController : BaseController
  {
    private readonly DefaultDbContext _context;

    public ImportListController(DefaultDbContext context)
    {
      _context = context;
    }

    /// <summary>
    /// Get collection of ImportLists
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IEnumerable<ImportList> Get()
    {
      var result = _context.ImportLists.Where(x => x.UserId == CurrentUserId).OrderByDescending((o) => o.Date);
      return result;
    }

    // GET api/importlist/5
    [HttpGet("{id}")]
    public ImportList Get(int id)
    {
      return _context.ImportLists.Find(id);
    }


    // GET api/importlist/startimport
    [HttpGet("startimport")]
    public async Task<IActionResult> StartImport()
    {
      var bl = new ImportBL(_context);
      var settings = _context.UserSettings.Where(x => x.UserId == CurrentUserId && x.Active).FirstOrDefault();
      await bl.Import(settings);
      return Ok();
    }

    // GET api/importlist/loadchanges
    [HttpGet("loadchanges/{importId}")]
    public ChangesSet LoadChanges(int importId)
    {
      var bl = new ImportBL(_context);
      var result = bl.GetChanges(importId, CurrentUserId);
      return result;
    }

    // DELETE api/importlist/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var list = new ImportList() { Id = id };
      _context.Entry(list).State = EntityState.Deleted;

      await _context.SaveChangesAsync();
      return Ok();
    }
  }
}

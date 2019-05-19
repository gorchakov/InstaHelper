using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using aspnetCoreReactTemplate.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using System;
using System.Security.Claims;
using api.BL;
using Microsoft.AspNetCore.Identity;

namespace aspnetCoreReactTemplate.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  public class SettingsController : BaseController
  {
    private readonly DefaultDbContext _context;
    
    public SettingsController(DefaultDbContext context)
    {
      _context = context;
    }

    /// <summary>
    /// Get collection of UserSettings
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IEnumerable<UserSettings> Get()
    {
      return _context.UserSettings.Where(x => x.UserId == CurrentUserId).OrderByDescending((o) => o.Updated);
    }

    // GET api/settings/5
    [HttpGet("{id}")]
    public async Task<UserSettings> Get(int id)
    {
      return _context.UserSettings.Where(x=>x.UserId == CurrentUserId && x.Id == id).FirstOrDefault();
    }

    // POST api/settings
    [HttpPost]
    public async Task<IActionResult> Post([FromBody]UserSettings model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }
      model.Updated = DateTime.UtcNow;
      model.UserId = CurrentUserId;
     
      _context.UserSettings.Add(model);
      await _context.SaveChangesAsync();
      return CreatedAtRoute("GetSettings", new { id = model.Id }, model);
    }

    // PUT api/settings/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody]UserSettings model)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }
      if (!_context.UserSettings.Any(x => x.UserId == CurrentUserId && x.Id == id))
      {
        return BadRequest(ModelState);
      }

      _context.UserSettings.Update(model);
      model.Id = id;

      _context.UserSettings.Update(model);
      await _context.SaveChangesAsync();
      return Ok();
    }

    // DELETE api/settings/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var settings = new UserSettings() { Id = id };
      _context.Entry(settings).State = EntityState.Deleted;

      await _context.SaveChangesAsync();
      return Ok();
    }
  }
}

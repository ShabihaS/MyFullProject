using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieAPIDemo.Data;
using MovieAPIDemo.Entities;
using MovieAPIDemo.Models;


namespace MovieAPIDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly MovieDbContext _context;
        private readonly IMapper _mapper;

        public PersonController(MovieDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }



        // GET: api/Person
        [HttpGet]
        public IActionResult Get(int pageIndex = 0, int pageSize = 10)
        {

            BaseResponseModel response = new BaseResponseModel();


            try
            {
                var actorCount = _context.Person.Count();
                var actorList = _mapper.Map<List<ActorViewModel>>(_context.Person
                    .Skip(pageIndex * pageSize)
                    .Take(pageSize)
                    .ToList());

                response.status = true;
                response.message = "Actor fetched successfully";
                response.Data = new
                {
                    Count = actorCount,
                    Person = actorList,
                };

                return Ok(response);

            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = "An error occurred while fetching movies: " + ex.Message;
                return BadRequest(response);

            }
        }


        //// GET: api/Person/5
        //[HttpGet("{id}")]
        //public IActionResult GetPersonById(int id)
        //{

        //    BaseResponseModel response = new BaseResponseModel();


        //    try
        //    {

        //        var person = _context.Person.Where(x => x.Id == id).FirstOrDefault();

        //        if (person == null)
        //        {
        //            response.status = false;
        //            response.message = "Record Not Exist";

        //            return BadRequest(response);
        //        }

        //        var personData = _mapper.Map<ActorViewModel>(person);


        //        response.status = true;
        //        response.message = "Actor fetched successfully";
        //        response.Data = personData;


        //        return Ok(response);

        //    }
        //    catch (Exception ex)
        //    {
        //        response.status = false;
        //        response.message = "An error occurred while fetching movies: " + ex.Message;
        //        return BadRequest(response);

        //    }
        //}

       

// GET: api/Person/5
[HttpGet("{id}")]
    public IActionResult GetPersonById(int id)
    {
        BaseResponseModel response = new BaseResponseModel();

        try
        {
            var person = _context.Person
                .Include(p => p.Movies) // 👈 force EF to load related Movies
                .Where(x => x.Id == id)
                .Select(x => new ActorDetailsViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    DateOfBirth = x.DateOfBirth,
                    Movies = x.Movies.Select(m => m.Title).ToArray()
                })
                .FirstOrDefault();

            if (person == null)
            {
                response.status = false;
                response.message = "Record Not Exist";
                return BadRequest(response);
            }

            response.status = true;
            response.message = "Actor fetched successfully";
            response.Data = person;

            return Ok(response);
        }
        catch (Exception ex)
        {
            response.status = false;
            response.message = "An error occurred while fetching actor: " + ex.Message;
            return BadRequest(response);
        }
    }




    [HttpGet]
        [Route ("Search/{searchText}")]

        public IActionResult Get(string searchText)

        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                var searchPerson =
                    _context.Person.Where(x => x.Name.Contains(searchText)).Select(x => new 
                    {
                        x.Id,
                        x.Name,
                       
                    }).ToList();

                response.status = true;
                response.message = "Actor fetched successfully";
                response.Data = searchPerson;

                return Ok(response);

            }
            catch (Exception)
            {

                
                response.status = false;
                response.message = "Something went wrong";
                return BadRequest(response);
            }
        }

        // POST: api/Person
        [HttpPost]

        public IActionResult Post
            (ActorViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (ModelState.IsValid)
                {

                    var postedModel = new Person()

                    {
                        Name = model.Name,
                        DateOfBirth = model.DateOfBirth,
                    };
                    _context.Person.Add(postedModel);
                    _context.SaveChanges();

                    model.Id = postedModel.Id;

                    response.status = true;

                    response.message = "Actor Created Successfully";
                    response.Data = model;

                    return Ok(response);
                }
                else
                {
                    response.status = false;
                    response.message = "Validation Error";
                    response.Data = ModelState;

                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = "Something went wrong " + ex.Message;
                return BadRequest(response);

            }

        }

        // PUT: api/Person/5
        [HttpPut]
        public IActionResult Put(ActorViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (ModelState.IsValid)
                {
                    var postedModel = _mapper.Map<Person>(model);

                    if (model.Id <= 0)
                    {
                        response.status = false;
                        response.message = "Invalid Actor Id";
                        return BadRequest(response);
                    }

                    var personDetails = _context.Person.Where(x => x.Id == model.Id).AsNoTracking().FirstOrDefault();
                    if (personDetails == null)
                    {
                        response.status = false;
                        response.message = "Record Not Exist";
                        return BadRequest(response);
                    }
                    _context.Person.Update(postedModel);
                    _context.SaveChanges();

                    response.status = true;
                    response.message = "Actor Updated Successfully";
                    response.Data = postedModel;

                    return Ok(response);

                }

                else
                {
                    response.status = false;
                    response.message = "Validation Error";
                    response.Data = ModelState;
                    return BadRequest(response);
                }

            }
            catch (Exception)
            {
                response.status = false;
                response.message = "Something went wrong";
                return BadRequest(response);


            }
        }

        // DELETE: api/Person/5
        [HttpDelete]

        public IActionResult Delete(int id)

        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                var person = _context.Person.Where(x => x.Id == id).FirstOrDefault();

                if (person == null)
                {
                    response.status = false;
                    response.message = "Invalid Person Record";
                    return BadRequest(response);
                }

                _context.Person.Remove(person);
                _context.SaveChanges();

                response.status = true;
                response.message = "Deleted successfully";



                return Ok(response);
            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = $"Something went wrong: {ex.Message}";
                return BadRequest(response);

            }
        }
    }
}

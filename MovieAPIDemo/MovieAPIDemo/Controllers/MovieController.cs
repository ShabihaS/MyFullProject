using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieAPIDemo.Data;
using MovieAPIDemo.Entities;
using MovieAPIDemo.Models;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace MovieAPIDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly MovieDbContext _context;
        private readonly IMapper _mapper;
        private object allowedExtensions;

        public MovieController(MovieDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Movie
        [HttpGet]
        public IActionResult Get(int pageIndex = 0, int pageSize = 10)
        {

            BaseResponseModel response = new BaseResponseModel();


            try
            {
                var movieCount = _context.Movie.Count();
                var movieList = _mapper.Map<List<MovieListViewModel>>(_context.Movie.Include(x => x.Actors)
                    .Skip(pageIndex * pageSize)
                    .Take(pageSize)
                    .ToList());

                response.status = true;
                response.message = "Movies fetched successfully";
                response.Data = new
                {
                    Count = movieCount,
                    Movies = movieList
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
        // GET: api/Movie/5
        [HttpGet("{id}")]
        public IActionResult GetMovieByID(int id)
        {

            BaseResponseModel response = new BaseResponseModel();


            try
            {

                var movie = _context.Movie.Include(x => x.Actors).Where(x => x.Id == id)
                   .FirstOrDefault();

                if (movie == null)
                {
                    response.status = false;
                    response.message = "Record Not Exist";

                    return BadRequest(response);
                }

                var movieData = _mapper.Map<MovieDetailsVieModel>(movie);

                response.status = true;
                response.message = "Movies fetched successfully";
                response.Data = movieData;



                return Ok(response);

            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = "An error occurred while fetching movies: " + ex.Message;
                return BadRequest(response);

            }
        }


        // POST: api/Movie
        [HttpPost]

        public IActionResult Post
            (CreatedMovieViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (ModelState.IsValid)
                {
                    var actors = _context.Person.Where(x => model.Actors.Contains(x.Id)).ToList();

                    if (actors.Count != model.Actors.Count)
                    {
                        response.status = false;
                        response.message = "Invalid Actor Assigned";
                        return BadRequest(response);
                    }

                    var postedModel = _mapper.Map<Movie>(model);
                    postedModel.Actors = actors;

                    _context.Movie.Add(postedModel);
                    _context.SaveChanges();

                    var responseData = _mapper.Map<MovieDetailsVieModel>(postedModel);

                    response.status = true;
                    response.message = "Movie Created Successfully";
                    response.Data = responseData;

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

        [HttpPut]

        public IActionResult Put
           (CreatedMovieViewModel model)
        {
            BaseResponseModel response = new BaseResponseModel();
            try
            {
                if (ModelState.IsValid)
                {

                    if (model.Id <= 0)
                    {
                        response.status = false;
                        response.message = "Please provide valid Movie Id";
                        return BadRequest(response);
                    }

                    var actors = _context.Person.Where(x => model.Actors.Contains(x.Id)).ToList();

                    if (actors.Count != model.Actors.Count)
                    {
                        response.status = false;
                        response.message = "Invalid Actor Assigned";
                        return BadRequest(response);
                    }

                    var movieDetails = _context.Movie.Include(x => x.Actors).Where(x => x.Id == model.Id).FirstOrDefault();

                    if (movieDetails == null)
                    {
                        response.status = false;
                        response.message = "Record Not Exist";
                        return BadRequest(response);
                    }
                    movieDetails.Title = model.Title;
                    movieDetails.Description = model.Description;
                    movieDetails.Language = model.Language;
                    movieDetails.ReleaseDate = model.ReleaseDate;
                    movieDetails.CoverImage = model.CoverImage;

                    //Find removed actor

                    var removedActors = movieDetails.Actors.Where(x => !model.Actors.Contains(x.Id)).ToList();
                    foreach (var actor in removedActors)
                    {
                        movieDetails.Actors.Remove(actor);
                    }

                    //Find newly added actors

                    var addedActors = actors.Except(movieDetails.Actors).ToList();

                    foreach (var actor in addedActors)
                    {
                        movieDetails.Actors.Add(actor);
                    }

                    _context.SaveChanges();




                    response.status = true;
                    response.message = "Movie Created Successfully";
                    response.Data = addedActors;

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
        [HttpDelete]

        public IActionResult Delete(int id)

        {
            BaseResponseModel response = new BaseResponseModel();

            try
            {
                var movie = _context.Movie.Where(x => x.Id == id).FirstOrDefault();

                if (movie == null)
                {
                    response.status = false;
                    response.message = "Movie not found";
                    return BadRequest(response);
                }

                _context.Movie.Remove(movie);
                _context.SaveChanges();

                response.status = true;
                response.message = "Movie deleted successfully";



                return Ok(response);
            }
            catch (Exception ex)
            {
                response.status = false;
                response.message = $"Something went wrong: {ex.Message}";
                return BadRequest(response);

            }
        }

        [HttpPost]
        [Route("upload-movie-poster")]
        public async Task<IActionResult> UploadMoviePoster(IFormFile imageFile)
        {
            try
            {
                var fileName = ContentDispositionHeaderValue
                    .Parse(imageFile.ContentDisposition)
                    .FileName.Trim('"');

                string newPath = @"D:\MyFullProject\MovieAPIDemo";
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }

                string[] allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };
                if (!allowedExtensions.Contains(Path.GetExtension(fileName).ToLower()))
                {
                    return BadRequest(new BaseResponseModel
                    {
                        status = false,
                        message = "Only .jpg, .jpeg, .png file extensions are allowed"
                    });
                }

                string newFileName = Guid.NewGuid() + Path.GetExtension(fileName);
                string fullPath = Path.Combine(newPath, newFileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                return Ok(new
                {
                    profileImage = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/StaticFiles/{newFileName}"
                });
            }
            catch (Exception)
            {
                return BadRequest(new BaseResponseModel
                {
                    status = false,
                    message = "Error Occurred"
                });
            }
        }
    }
}









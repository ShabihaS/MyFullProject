using AutoMapper;
using MovieAPIDemo.Entities;
using MovieAPIDemo.Models;


namespace MovieAPIDemo
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
             CreateMap<Movie, MovieListViewModel>();
            CreateMap<Movie,MovieDetailsVieModel>();
            CreateMap<MovieListViewModel,Movie >();
            CreateMap<CreatedMovieViewModel, Movie>().ForMember(x => x.Actors, y => y.Ignore());

            CreateMap<Person, ActorViewModel>();
            CreateMap<Person, ActorDetailsViewModel>();
            CreateMap<ActorViewModel, Person>();
           

        }
    }
}

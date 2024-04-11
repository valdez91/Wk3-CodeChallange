
const baseUrl = 'http://localhost:3000';
// global variables
let currentMovie = null;
let moviesData = [];
// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", async () => {
    // Linking html Dom elements
    const movieList = document.getElementById('films');
    const movieTitle = document.getElementById('title');
    const movieRuntime = document.getElementById('runtime');
    const movieShowtime = document.getElementById('showtime');
    const movieDescription = document.getElementById('film-info');
    const moviePoster = document.getElementById('poster');
    const buyTicketButton = document.getElementById('buy-ticket');
    const deleteFilmButton = document.getElementById('delete-movie');
    const ticketNum = document.getElementById('ticket-num');

    
    // Function to display movie Details
    const MovieDetails = async (movie) => {
        moviePoster.src = movie.poster;
        moviePoster.alt = movie.title;
        movieTitle.innerHTML = movie.title;
        movieRuntime.innerHTML = `${movie.runtime} minutes`;
        movieShowtime.innerHTML = movie.showtime;
        movieDescription.innerHTML = movie.description;
        // Available Tickets
        ticketNum.innerHTML = movie.capacity - movie.tickets_sold;

        // Updating the button text based on ticket Availability
        if (movie.tickets_sold >= movie.capacity) {
            buyTicketButton.textContent = 'Sold Out';
            buyTicketButton.setAttribute('disabled', 'true');
        } 
        // Enabling the Buy Ticket Button
        else {
            buyTicketButton.textContent = 'Buy Ticket';
            buyTicketButton.removeAttribute('disabled');
        }

        // Enabling the Delete Movie Button
        deleteFilmButton.removeAttribute('disabled');
    }

    // Function to handle the Buy Ticket button click
    const buyTicket = async () => {
        // Preventing the default form submission
        event.preventDefault();
        if (currentMovie) {
            // Checking if there are any available tickets
            if (currentMovie.tickets_sold < currentMovie.capacity) {
                // Update the sold tickets count
                currentMovie.tickets_sold++;
                await updateTicketInfo(currentMovie);
                MovieDetails(currentMovie);
            }
        }
    }

    // Function to handle updating the information on the server
    const updateTicketInfo = async (movie) => {
        if (movie) {
            try {
                // Sending a PUT request to the server
                const response = await fetch(`${baseUrl}/films/${movie.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(movie),
                })
                //  Checking if the request was successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedMovie = await response.json();

                // Update the currentMovie with the updated data
                currentMovie = updatedMovie;
                MovieDetails(updatedMovie);

            } catch (error) {
                console.error('Update erroe:', error);
            }
        }
    }

    // Function to handle the Delete Movie Button Click
    const deleteCurrentMovie = async () => {
        if (currentMovie) {
            try {
                // Send a DELETE request to the server
                const response = await fetch(`${baseUrl}/films/${currentMovie.id}`, {
                    method: 'DELETE',
                })
                // Checking if the request was successful
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                await response.json();

                // Remove the movie from the local data
                const index = moviesData.findIndex((m) => m.id === currentMovie.id);
                if (index!== -1) {
                    moviesData.splice(index, 1);
                }

                // Clear the currentMovie
                currentMovie = null;

                // Clear Movie Details elements
                movieTitle.innerHTML = ''
                moviePoster.innerHTML = '';
                movieDescription.innerHTML = '';
                movieRuntime.innerHTML = '';
                movieShowtime.innerHTML = '';
                ticketNum.innerHTML = '';

                // Disabling the Buy Ticket and Delete Movie Button
                buyTicketButton.setAttribute('disabled', 'true');
                deleteFilmButton.setAttribute('disabled', 'true');

                // Updating the movie menu
                updateMovieList();

                // Display details of the first movie in the updated list
                if (moviesData.length > 0) {
                    currentMovie = moviesData[0];
                    MovieDetails(currentMovie);
                }
            } catch (error) {
                console.error('Delete Error', error);
            }
        }
    }

    // Function to update the movie list
    const updateMovieList = () => {
        // Clear any existing li elements
        movieList.innerHTML = '';

        // Create and populate li elements for each movie
        moviesData.forEach((movie) => {
            const li = document.createElement('li');
            li.textContent = movie.title;

            // Adding an event listener to the li element
            li.addEventListener('click', () => {
                currentMovie = movie;
                MovieDetails(movie);
            });

            //Append the li element to the movieList
            movieList.appendChild(li);
        });
    }

    // Fetching the movies data from the server
    const fetchMovies = async () => {
        try {
            const response = await fetch(`${baseUrl}/films`);
            moviesData = await response.json();

            // Display details of the first movie in the list
            if (moviesData.length > 0) {
                currentMovie = moviesData[0];
                MovieDetails(currentMovie);
            }

            updateMovieList();

        } catch (error) {
            console.error('Fetch Error:', error);
        }
    }

    // Calling the fetchMovies function
    fetchMovies();

    // Adding event listeners to the buttons
    buyTicketButton.addEventListener('click', buyTicket);
    deleteFilmButton.addEventListener('click', deleteCurrentMovie);
});
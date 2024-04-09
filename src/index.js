// Set the base URL for the API
const baseUrl = "http://localhost:3000";

// Define the movie object in the global scope
let movie;

// Wait for the DOM to be fully loaded before running any code
document.addEventListener("DOMContentLoaded", async () => {

    // Fetch movie details
    async function fetchFilmDetails() {
        try {
            const response = await fetch(baseUrl + "/films/1");
            movie = await response.json(); // Assign to the global movie variable
            // Update the DOM with the movie details
            document.getElementById("title").innerHTML = movie.title;
            document.getElementById("runtime").innerHTML = movie.runtime + " minutes";
            document.getElementById("showtime").innerHTML = movie.showtime;
            document.getElementById("film-info").innerHTML = movie.description;
            document.getElementById("poster").src = movie.poster;
            document.getElementById("poster").alt = movie.title;
            document.getElementById("ticket-num").innerHTML = movie.capacity - movie.tickets_sold;
        } catch (error) {
            console.error('Error fetching film details:', error);
        }
    }

    // Call the fetchFilmDetails function to load the movie details when the page loads
    await fetchFilmDetails();

    // Create movie menu list
    async function fetchAllMovies() {
        try {
            const movieMenu = document.getElementById('films');
            movieMenu.innerHTML = '';
            const response = await fetch(baseUrl + "/films");
            const films = await response.json();
            films.forEach(movie => {
                const listItem = document.createElement('li');
                listItem.classList.add('film', 'item');
                listItem.innerHTML = movie.title;
                movieMenu.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error fetching movie list:", error);
        }
    }

    // Call the fetchAllMovies function to load the movie list when the page loads
    await fetchAllMovies();

    // Make the film Menu Clickable
    const filmMenu = document.getElementById('films');
    filmMenu.addEventListener('click', async (event) => {
        try {
            const selectedMovie = event.target.textContent;
            const response = await fetch(baseUrl + "/films");
            const films = await response.json();
            films.forEach(movie => {
                if (movie.title === selectedMovie) {
                    // Update the DOM with the selected movie details
                    document.getElementById("title").innerHTML = movie.title;
                    document.getElementById("runtime").innerHTML = movie.runtime + " minutes";
                    document.getElementById("showtime").innerHTML = movie.showtime;
                    document.getElementById("film-info").innerHTML = movie.description;
                    document.getElementById("poster").src = movie.poster;
                    document.getElementById("poster").alt = movie.title;
                    document.getElementById("ticket-num").innerHTML = movie.capacity - movie.tickets_sold;
                }
            });
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    });

    // Buy Ticket
    const buyTicketButton = document.getElementById('buy-ticket');
    buyTicketButton.addEventListener('click', async () => {
        try {
            const response = await fetch(baseUrl + `/films/1/tickets`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tickets_sold: movie.tickets_sold + 1
                })
            });
    
            // Check if response is successful
            if (!response.ok) {
                // Handle the error response
                throw new Error(`Failed to buy ticket: ${response.statusText}`);
            }
    
            const data = await response.json();
            // Update the DOM with the new number of tickets available
            const remainingTickets = data.capacity - data.tickets_sold;
            document.getElementById("ticket-num").innerHTML = remainingTickets;
            if (remainingTickets === 0) {
                document.getElementById("buy-ticket").innerHTML = "Sold Out";
            }
        } catch (error) {
            console.error('Error buying ticket:', error);
        }
    });


});


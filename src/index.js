// Set the base URL for the API
const baseUrl = 'http://localhost:3000';

// Fetch the first movie's details when the page loads
fetch(`${baseUrl}/films/1`)
 .then(response => response.json())
 .then(film => {
    // Display the movie's details
    const filmDetails = document.getElementById('film-details');
    filmDetails.innerHTML = `
      <img src="${film.poster}" alt="${film.title} poster">
      <h3>${film.title}</h3>
      <p>Runtime: ${film.runtime} minutes</p>
      <p>Showtime: ${film.showtime}</p>
      <p>Available Tickets: ${film.capacity - film.tickets_sold}</p>
    `;
  })
 .catch(error => {
    console.error('Error fetching film data:', error);
  });

// Fetch all movies when the page loads
fetch(`${baseUrl}/films`)
 .then(response => response.json())
 .then(films => {
    // Display a menu of all movies
    const filmsList = document.getElementById('films');
    films.forEach(film => {
      const filmItem = document.createElement('li');
      filmItem.classList.add('film', 'item');
      filmItem.innerHTML = `
        <img src="${film.poster}" alt="${film.title} poster">
        <h3>${film.title}</h3>
        <p>Runtime: ${film.runtime} minutes</p>
        <p>Showtime: ${film.showtime}</p>
        <button class="buy-ticket" data-film-id="${film.id}">${film.tickets_sold < film.capacity? 'Buy Ticket' : 'Sold Out'}</button>
        <button class="delete-film" data-film-id="${film.id}">Delete</button>
      `;
      filmsList.appendChild(filmItem);

      // Add an event listener to the "Buy Ticket" button
      filmItem.querySelector('.buy-ticket').addEventListener('click', () => {
        // Make a PATCH request to the /films/:id endpoint to update the number of tickets sold
        fetch(`${baseUrl}/films/${film.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tickets_sold: film.tickets_sold + 1
          })
        })
       .then(response => response.json())
       .then(updatedFilm => {
          // Update the film data in the DOM
          filmItem.querySelector('button').textContent = updatedFilm.tickets_sold < updatedFilm.capacity? 'Buy Ticket' : 'Sold Out';

          if (updatedFilm.tickets_sold === updatedFilm.capacity) {
            // Add the sold-out class to the film item
            filmItem.classList.add('sold-out');
          } else {
            // Remove the sold-out class from the film item
            filmItem.classList.remove('sold-out');
          }
        })
       .catch(error => {
          console.error('Error updating film data:', error);
        });

        // Make a POST request to the /tickets endpoint to create a new ticket
        fetch(`${baseUrl}/tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            film_id: film.id,
            number_of_tickets: 1
          })
       })
       .then(response => response.json())
       .then(newTicket => {
          console.log('New ticket created:', newTicket);
        })
       .catch(error => {
          console.error('Error creating ticket:', error);
        });
      });

      // Add an event listener to the "Delete" button
      filmItem.querySelector('.delete-film').addEventListener('click', () => {
        // Make a DELETE request to the /films/:id endpoint to delete the film
        fetch(`${baseUrl}/films/${film.id}`, {
          method: 'DELETE'
        })
       .then(() => {
          // Remove the film item from the DOMS
          filmsList.removeChild(filmItem);
        })
       .catch(error => {
          console.error('Error deleting film:', error);
        });
      });
    });
  })
 .catch(error => {
    console.error('Error fetching film data:', error);
  });
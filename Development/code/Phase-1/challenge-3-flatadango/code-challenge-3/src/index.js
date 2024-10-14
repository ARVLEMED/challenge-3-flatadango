document.addEventListener("DOMContentLoaded", () => {
    fetchMovieDetails(); 
    fetchAllMovies();    
});


function fetchMovieDetails(movieId = 1) {
    fetch(`http://localhost:3000/films/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            displayMovieDetails(movie);
        });
}


function fetchAllMovies() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(movies => {
            const filmsList = document.getElementById('films');
            filmsList.innerHTML = ''; 

            movies.forEach(movie => {
                const li = document.createElement('li');
                li.className = 'film item';
                li.textContent = movie.title;

                
                li.addEventListener('click', () => {
                    fetchMovieDetails(movie.id);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'ui button';
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    deleteMovie(movie.id, li);
                });

                li.appendChild(deleteButton);
                filmsList.appendChild(li);
            });
        });
}


function displayMovieDetails(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;

    document.getElementById('poster').src = movie.poster;
    document.getElementById('title').textContent = movie.title;
    document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
    document.getElementById('film-info').textContent = movie.description;
    document.getElementById('showtime').textContent = movie.showtime;
    document.getElementById('ticket-num').textContent = availableTickets;

    const buyTicketButton = document.getElementById('buy-ticket');
    buyTicketButton.disabled = availableTickets === 0;
    buyTicketButton.textContent = availableTickets === 0 ? "Sold Out" : "Buy Ticket";

    buyTicketButton.onclick = () => {
        buyTicket(movie);
    };
}


function buyTicket(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;

    if (availableTickets > 0) {
        const updatedTicketsSold = movie.tickets_sold + 1;

        
        fetch(`http://localhost:3000/films/${movie.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: updatedTicketsSold })
        })
        .then(response => response.json())
        .then(updatedMovie => {
            
            fetch('http://localhost:3000/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    film_id: updatedMovie.id,
                    number_of_tickets: 1
                })
            });

            
            displayMovieDetails(updatedMovie);

            
            if (updatedMovie.tickets_sold === updatedMovie.capacity) {
                const filmsList = document.getElementById('films');
                const filmItem = Array.from(filmsList.children).find(li => li.textContent.includes(updatedMovie.title));
                filmItem.classList.add('sold-out');
            }
        });
    } else {
        alert("This showing is sold out!");
    }
}

function deleteMovie(id, listItem) {
    fetch(`http://localhost:3000/films/${id}`, {
        method: 'DELETE'
    }).then(() => {
        listItem.remove();
    });
}

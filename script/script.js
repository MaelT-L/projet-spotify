// Graphique 1 : Top 10 des artistes (nombre de morceaux)
fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        // Extraction des noms d'artistes
        const artistCounts = {};

        data.forEach(track => {
            track.artists.forEach(artist => {
                const name = artist.name;
                artistCounts[name] = (artistCounts[name] || 0) + 1;
            });
        });

        // Conversion en tableau et tri pour garder le top 10
        const sortedArtists = Object.entries(artistCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const labels = sortedArtists.map(entry => entry[0]);
        const values = sortedArtists.map(entry => entry[1]);

        // Initialisation du graphique
        const ctx = document.getElementById('graph1').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: "Top 10 des artistes (nombre de morceaux)",
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        precision: 0
                    }
                }
            }
        });
    })
    .catch(error => console.error('Erreur lors du chargement du JSON :', error));

// Graphique 2 : Distribution des genres
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    const genreCounts = {};

    data.forEach(track => {
      track.artists.forEach(artist => {
        if (artist.genres && Array.isArray(artist.genres)) {
          artist.genres.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });
    });

    const sortedGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1]);

    const topGenres = sortedGenres.slice(0, 7);
    const otherGenresCount = sortedGenres.slice(7).reduce((sum, entry) => sum + entry[1], 0);

    const labels = topGenres.map(entry => entry[0]).concat('Autres');
    const values = topGenres.map(entry => entry[1]).concat(otherGenresCount);

    const ctx = document.getElementById('graph2').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
      labels: labels,
      datasets: [{
        label: "Distribution des genres",
        data: values,
        backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(89, 128, 205, 0.6)',
        'rgba(128, 128, 128, 0.6)'
        ],
        borderColor: 'white',
        borderWidth: 1
      }]
      },
      options: {
      responsive: true
      }
    });
  })
  .catch(error => console.error('Erreur lors du chargement du JSON pour Graphique 2 :', error));

// Ajout lignes tableau
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    const tbody = document.querySelector('#tableau-musique tbody');

    data.forEach(track => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${track.name}</td>
        <td>${track.artists.map(artist => artist.name).join(', ')}</td>
        <td>${track.album.name}</td>
        <td><button type="button" class="btn btn-primary">
          <i class="bi bi-info-circle me-1"></i> Détails
        </button></td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Erreur lors du chargement des données :', error);
  });

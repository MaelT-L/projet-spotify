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
      responsive: true,
      plugins: {
        legend: {
        position: 'right'
        }
      }
      }
    });
  })
  .catch(error => console.error('Erreur lors du chargement du JSON pour Graphique 2 :', error));

// Ajout lignes tableau
fetch('data/data.json')
  .then(response => response.json())
  .then(data => {
    const tbody = document.querySelector('#tableau-musique tbody');

    data.forEach((track, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${track.name}</td>
        <td>${track.artists.map(artist => artist.name).join(', ')}</td>
        <td>${track.album.name}</td>
        <td><button type="button" class="btn btn-primary btn-detail" data-index="${i}">
          <i class="bi bi-info-circle me-1"></i> Détails
        </button></td>
      `;
      tbody.appendChild(row);
    });

    tbody.querySelectorAll('.btn-detail').forEach(btn => {
      btn.addEventListener('click', function() {
        const track = data[this.getAttribute('data-index')];
        showTrackModal(track);
      });
    });
  })
  .catch(error => {
    console.error('Erreur lors du chargement des données :', error);
  });

// Modal détails des morceaux
function showTrackModal(track) {
  // Supprime un éventuel ancien modal
  const oldModal = document.getElementById('modal-detail');
  if (oldModal) oldModal.remove();

  // Crée le HTML du modal
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'modal-detail';
  modal.tabIndex = -1;
  modal.setAttribute('aria-labelledby', 'modalDetailLabel');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
  <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalDetailLabel">Détails du morceau</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-4 text-center">
              <img src="${track.album.images?.[0]?.url || 'placeholder.jpg'}" class="img-fluid rounded mb-2" alt="${track.album.name}">
              <div><strong>${track.album.name}</strong> (${track.album.release_date || ''})<br>
              <span class="badge bg-success">Popularité: ${track.popularity || track.album.popularity || 0}/100</span></div>
            </div>
            <div class="col-md-8">
              <h5>${track.name} - ${track.artists.map(a => a.name).join(', ')}</h5>
              <p>Preview audio</p>
              <audio controls src="${track.preview_url || ''}" class="w-100 mb-2" ${track.preview_url ? '' : 'style="display:none"'}></audio>
              <p>Informations sur le morceau</p>
              <ul class="list-group mb-2">
                <li class="list-group-item"><strong>Durée :</strong> ${msToMinSec(track.duration_ms)}</li>
                <li class="list-group-item"><strong>Popularité :</strong> ${track.popularity || 0}/100</li>
                <li class="list-group-item"><strong>Numéro de piste :</strong> ${track.track_number || ''}</li>
                <li class="list-group-item"><strong>Explicit :</strong> ${track.explicit ? 'Oui' : 'Non'}</li>
              </ul>
              <p>Artiste(s)</p>
              <div class="d-flex flex-wrap gap-3 mb-2">
                ${track.artists.map(a => `
                  <div class="text-center" style="min-width:100px;">
                    <img src="${a.images?.[0]?.url || 'placeholder.jpg'}" alt="${a.name}" class="rounded-circle mb-1" style="width:64px;height:64px;object-fit:cover;">
                    <div><strong>${a.name}</strong></div>
                    <div>Popularité : ${a.popularity !== undefined ? a.popularity : 'N/A'}/100</div>
                    <div>Followers : ${a.followers?.total !== undefined ? a.followers.total.toLocaleString() : 'N/A'}</div>
                  </div>
                `).join('')}
              </div>
              <div class="mt-2">
                <a href="${track.external_urls?.spotify || '#'}" target="_blank" class="btn btn-success">Ouvrir dans Spotify</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Affiche le modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  // Nettoie le DOM après fermeture du modal
  modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

// Utilitaire pour convertir ms en min:sec
function msToMinSec(ms) {
  if (!ms) return '';
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

// 12 albums populaires
function afficherAlbumsPopulaires() {
  fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
      // Récupérer les albums uniques
      const albums = data.map(track => track.album);
      const uniqueAlbums = Array.from(new Set(albums.map(album => album.id)))
        .map(id => albums.find(album => album.id === id));

      // Trier les albums par popularité et prendre les 12 premiers
      const sortedAlbums = uniqueAlbums.sort((a, b) => b.popularity - a.popularity).slice(0, 12);

      // Sélectionner le conteneur
      const container = document.getElementById('albums-populaires');
      let row;

      sortedAlbums.forEach((album, index) => {
        // Créer une nouvelle ligne toutes les 6 cartes
        if (index % 6 === 0) {
          row = document.createElement('div');
          row.className = 'row mb-4'; // Ajouter une marge entre les lignes
          container.appendChild(row);
        }

        // Créer une carte pour chaque album
        const card = document.createElement('div');
        card.className = 'col-2'; // Chaque carte occupe 2 colonnes
        card.innerHTML = `
          <div class="card h-100">
            <img src="${album.images[0]?.url || 'placeholder.jpg'}" class="card-img-top" alt="${album.name}">
            <div class="card-body">
              <h5 class="card-title">${album.name}</h5>
              <p class="card-subtitle">${album.artists.map(artist => artist.name).join(', ')}</p>
              <p class="card-text">${new Date(album.release_date).toLocaleDateString()}</p>
              <div class="container">
                <div class="row">
                  <p class="card-text col-6">${album.total_tracks} titres</p>
                  <p class="card-text col-6">${album.popularity}/100</p>
                </div>
              </div>
              
            </div>
          </div>
        `;
        row.appendChild(card);
      });
    })
    .catch(error => console.error('Erreur lors du chargement des albums populaires :', error));
}
// Appeler la fonction pour afficher les albums
afficherAlbumsPopulaires();
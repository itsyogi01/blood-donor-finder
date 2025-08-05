const donors = [];

document.getElementById('donorForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const city = document.getElementById('city').value.toLowerCase();
  const bloodGroup = document.getElementById('bloodGroup').value;
  const contact = document.getElementById('contact').value;
  const lastDonation = document.getElementById('lastDonation').value;
  const available = document.getElementById('availability').checked;
  const photoInput = document.getElementById('photo');

  const reader = new FileReader();

  reader.onload = function () {
    const photoURL = reader.result;

    donors.push({ name, age, city, bloodGroup, contact, lastDonation, available, photoURL });
    alert("Donor Registered Successfully!");
    document.getElementById('donorForm').reset();
    updateDonorCount();
  };

  if (photoInput.files[0]) {
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    donors.push({ name, age, city, bloodGroup, contact, lastDonation, available, photoURL: '' });
    alert("Donor Registered (without photo)!");
    document.getElementById('donorForm').reset();
    updateDonorCount();
  }
});

function isEligible(lastDate) {
  const now = new Date();
  const last = new Date(lastDate);
  const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  return diff >= 90;
}

function updateDonorCount() {
  document.getElementById('donorCount').innerText = donors.length;
}

function searchDonors() {
  const city = document.getElementById('searchCity').value.toLowerCase();
  const bloodGroup = document.getElementById('searchBlood').value;

  const results = donors.filter(
    d => d.city === city && d.bloodGroup === bloodGroup && d.available && isEligible(d.lastDonation)
  );

  const list = document.getElementById('donorList');
  list.innerHTML = '';

  if (results.length === 0) {
    list.innerHTML = "<p>No eligible donors found.</p>";
    return;
  }

  results.forEach(donor => {
    const card = document.createElement('div');
    card.className = 'donor-card';

    const img = document.createElement('img');
    img.src = donor.photoURL || 'https://via.placeholder.com/80';
    img.alt = "Donor Photo";

    const info = document.createElement('div');
    info.innerHTML = `
      <strong>${donor.name}</strong><br/>
      Age: ${donor.age}<br/>
      Blood Group: ${donor.bloodGroup}<br/>
      Last Donation: ${donor.lastDonation}<br/>
      City: ${donor.city}<br/>
      Contact: ${donor.contact}<br/>
      <span style="color:green;">✅ Available</span>
    `;

    card.appendChild(img);
    card.appendChild(info);
    list.appendChild(card);
  });
}
const storageKey = 'pet-med-tracker-v1';
const load = () => JSON.parse(localStorage.getItem(storageKey) || '[]');
const save = pets => localStorage.setItem(storageKey, JSON.stringify(pets));

function createDoseWindows(schedule) {
  const lower = schedule.toLowerCase();
  if (lower.includes('12')) return ['8:00 AM', '8:00 PM'];
  if (lower.includes('8')) return ['6:00 AM', '2:00 PM', '10:00 PM'];
  if (lower.includes('day') || lower.includes('daily')) return ['8:00 AM'];
  return ['Morning', 'Evening'];
}

function render() {
  const pets = load();
  const petsEl = document.getElementById('pets');
  const summary = document.getElementById('summary');
  petsEl.innerHTML = '';
  const totalDoses = pets.reduce((count, pet) => count + pet.windows.length, 0);
  const completed = pets.reduce((count, pet) => count + pet.completed.length, 0);
  summary.innerHTML = `
    <div><strong>${pets.length}</strong><br><span class="muted">pets tracked</span></div>
    <div><strong>${completed}/${totalDoses}</strong><br><span class="muted">doses logged today</span></div>
  `;

  pets.forEach((pet, petIndex) => {
    const card = document.createElement('article');
    card.className = 'pet';
    card.innerHTML = `
      <div><span class="pill">${pet.species}</span><span class="pill">${pet.medication}</span></div>
      <h3>${pet.name}</h3>
      <p><strong>Dose:</strong> ${pet.dose}</p>
      <p><strong>Schedule:</strong> ${pet.schedule}</p>
      <p class="muted">${pet.notes || 'No extra notes'}</p>
      <div class="dose-log"></div>
    `;
    const log = card.querySelector('.dose-log');
    pet.windows.forEach(window => {
      const btn = document.createElement('button');
      const key = `${new Date().toDateString()}-${window}`;
      btn.textContent = `${window}`;
      if (pet.completed.includes(key)) btn.classList.add('done');
      btn.addEventListener('click', () => {
        const pets = load();
        const completedSet = new Set(pets[petIndex].completed);
        completedSet.has(key) ? completedSet.delete(key) : completedSet.add(key);
        pets[petIndex].completed = [...completedSet];
        save(pets);
        render();
      });
      log.appendChild(btn);
    });
    petsEl.appendChild(card);
  });

  if (!pets.length) {
    petsEl.innerHTML = '<p class="muted">No pets added yet. Start with one medication plan or load the demo.</p>';
  }
}

document.getElementById('pet-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const pet = Object.fromEntries(form.entries());
  const pets = load();
  pets.push({ ...pet, windows: createDoseWindows(pet.schedule), completed: [] });
  save(pets);
  event.target.reset();
  render();
});

document.getElementById('load-demo').addEventListener('click', () => {
  save([
    { name: 'Milo', species: 'Cat', medication: 'Prednisolone', dose: '1 tablet', schedule: 'Every 12 hours', notes: 'Give after breakfast', windows: ['8:00 AM', '8:00 PM'], completed: [] },
    { name: 'Poppy', species: 'Dog', medication: 'Carprofen', dose: '20mg', schedule: 'Daily', notes: 'Take with dinner', windows: ['6:00 PM'], completed: [] }
  ]);
  render();
});

render();

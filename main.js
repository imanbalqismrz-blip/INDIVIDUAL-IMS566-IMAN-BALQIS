const INITIAL_ANIMALS = [
    { name: "Yayan", species: "Crocodile", breed: "Malaysian Crocodile", age: 25, gender: "Female", status: "unavailable", adopter: "-", adoptionDate: "-" },
    { name: "Binto", species: "Cat", breed: "Persian", age: 6, gender: "Male", status: "adopted", adopter: "Khaish", adoptionDate: "2026-01-14" },
    { name: "Jeli", species: "Dog", breed: "Husky", age: 4, gender: "Male", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Luna", species: "Cat", breed: "Siamese", age: 1, gender: "Female", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Tempe", species: "Bird", breed: "Cockatiel", age: 2, gender: "Female", status: "adopted", adopter: "Intan Nur", adoptionDate: "2026-02-03" },
    { name: "Milo", species: "Goat", breed: "Pygmy Goat", age: 3, gender: "Male", status: "adopted", adopter: "Wan Zafriel", adoptionDate: "2026-02-19" },
    { name: "Babacici", species: "Rabbit", breed: "Chinchilla Rex", age: 4, gender: "Female", status: "adopted", adopter: "Bunga", adoptionDate: "2026-03-05" },
    { name: "Belang", species: "Snake", breed: "Corn Snake", age: 4, gender: "Male", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Bobo", species: "Dog", breed: "Golden Retriever", age: 2, gender: "Male", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Pucha", species: "Dog", breed: "Pomeranian", age: 1, gender: "Female", status: "adopted", adopter: "Chempaka Indah", adoptionDate: "2026-03-22" },
    { name: "Oyen", species: "Cat", breed: "Domestic Shorthair", age: 4, gender: "Male", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Datin Pompom", species: "Cat", breed: "British Shorthair", age: 2, gender: "Female", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Kentang", species: "Rabbit", breed: "Lionhead", age: 1, gender: "Female", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Cantik", species: "Rabbit", breed: "Netherland Dwarf", age: 1, gender: "Female", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Sambalado", species: "Monkey", breed: "Vervet Monkey", age: 3, gender: "Male", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Atan", species: "Monkey", breed: "Capuchin Monkey", age: 3, gender: "Male", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "Murei", species: "Bird", breed: "Lovebird", age: 1, gender: "Female", status: "adopted", adopter: "Azriel", adoptionDate: "2026-04-10" },
    { name: "Pishang", species: "Rabbit", breed: "Dutch", age: 1, gender: "Male", status: "available", adopter: "-", adoptionDate: "-" },
    { name: "noodle", species: "Snake", breed: "Hognose Snake", age: 2, gender: "Male", status: "adopted", adopter: "Mahmood", adoptionDate: "2026-04-28" },
    { name: "Matchalah", species: "Goat", breed: "LaMancha", age: 3, gender: "Male", status: "available", adopter: "-", adoptionDate: "-" }
];

function getAnimals() {
    const saved = localStorage.getItem("pawpulseAnimals");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            console.error("Error parsing animals:", e);
        }
    }
    localStorage.setItem("pawpulseAnimals", JSON.stringify(INITIAL_ANIMALS));
    return INITIAL_ANIMALS;
}

function saveAnimals(animals) {
    localStorage.setItem("pawpulseAnimals", JSON.stringify(animals));
}

function updateDashboardStatistics() {
    const animals = getAnimals();
    const totalAnimals = animals.length;
    const availableAnimals = animals.filter(a => a.status === "available").length;
    const adoptedAnimals = animals.filter(a => a.status === "adopted").length;

    document.querySelectorAll("#totalAnimals").forEach(el => el.textContent = totalAnimals);
    document.querySelectorAll("#availableAnimals").forEach(el => el.textContent = availableAnimals);
    document.querySelectorAll("#adoptedAnimals").forEach(el => el.textContent = adoptedAnimals);
}

function openAddAnimalModal() {
    const form = document.getElementById("animalForm");
    if (form) form.reset();
    const idInput = document.getElementById("animalId");
    if (idInput) idInput.value = "";
    const title = document.getElementById("animalModalTitle");
    if (title) title.textContent = "Add New Animal";
}

function editAnimal(index) {
    const animals = getAnimals();
    const animal = animals[index];
    if (!animal) return;

    document.getElementById("animalId").value = index;
    document.getElementById("animalName").value = animal.name;
    document.getElementById("animalSpecies").value = animal.species;
    document.getElementById("animalBreed").value = animal.breed;
    document.getElementById("animalAge").value = animal.age;
    document.getElementById("animalGender").value = animal.gender;
    document.getElementById("animalStatus").value = animal.status;

    document.getElementById("animalModalTitle").textContent = "Edit Animal Details";
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("animalModal"));
    modal.show();
}

function renderAnimalTable(filterText = "", statusFilter = "all") {
    const tableBody = document.getElementById("animalTableBody");
    if (!tableBody) return;

    const animals = getAnimals();
    tableBody.innerHTML = "";

    const filteredAnimals = animals.filter((animal, index) => {
        const animalIdStr = "#A" + (1000 + index);
        const searchString = `${animal.name} ${animal.species} ${animal.breed} ${animalIdStr}`.toLowerCase();
        const matchesSearch = searchString.includes(filterText.toLowerCase());
        const matchesStatus = statusFilter === "all" || animal.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const noMsg = document.getElementById("noAnimalsMessage");
    if (filteredAnimals.length === 0) {
        if (noMsg) noMsg.classList.remove("d-none");
        return;
    } else if (noMsg) {
        noMsg.classList.add("d-none");
    }

    filteredAnimals.forEach((animal) => {
        const actualIndex = animals.indexOf(animal);
        const badgeClass = animal.status === "available" ? "bg-success" : animal.status === "adopted" ? "bg-info" : "bg-secondary";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="fw-semibold">#A${1000 + actualIndex}</td>
            <td>${animal.name}</td>
            <td>${animal.species}</td>
            <td>${animal.breed}</td>
            <td>${animal.age}</td>
            <td>${animal.gender}</td>
            <td><span class="badge ${badgeClass}">${animal.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editAnimal(${actualIndex})" title="Edit Record">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderAdoptionHistoryTable() {
    const adoptionBody = document.getElementById("adoptionHistoryBody");
    if (!adoptionBody) return;

    const animals = getAnimals();
    adoptionBody.innerHTML = "";

    animals.forEach((animal, index) => {
        if (animal.status === "adopted") {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="fw-semibold">#A${1000 + index}</td>
                <td>${animal.name}</td>
                <td>${animal.species} (${animal.breed})</td>
                <td>${animal.adopter || "Walk-in Adopter"}</td>
                <td>${animal.adoptionDate || "2026-05-01"}</td>
                <td><span class="badge bg-info">Completed</span></td>
            `;
            adoptionBody.appendChild(row);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateDashboardStatistics();
    renderAnimalTable();
    renderAdoptionHistoryTable();

    const searchInput = document.getElementById("animalSearch");
    const statusSelect = document.getElementById("statusFilter");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderAnimalTable(searchInput.value, statusSelect ? statusSelect.value : "all");
        });
    }

    if (statusSelect) {
        statusSelect.addEventListener("change", () => {
            renderAnimalTable(searchInput ? searchInput.value : "", statusSelect.value);
        });
    }

    const animalForm = document.getElementById("animalForm");
    if (animalForm) {
        animalForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const editIndex = document.getElementById("animalId").value;
            const name = document.getElementById("animalName").value.trim();
            const species = document.getElementById("animalSpecies").value;
            const breed = document.getElementById("animalBreed").value.trim();
            const age = document.getElementById("animalAge").value;
            const gender = document.getElementById("animalGender").value;
            const status = document.getElementById("animalStatus").value;

            const animals = getAnimals();

            if (editIndex !== "") {
                const existing = animals[editIndex];
                animals[editIndex] = {
                    ...existing,
                    name, species, breed, age, gender, status,
                    adopter: status === "adopted" && existing.adopter === "-" ? "Registered Adopter" : existing.adopter,
                    adoptionDate: status === "adopted" && existing.adoptionDate === "-" ? new Date().toISOString().split("T")[0] : existing.adoptionDate
                };
            } else {
                animals.push({
                    name, species, breed, age, gender, status,
                    adopter: status === "adopted" ? "Registered Adopter" : "-",
                    adoptionDate: status === "adopted" ? new Date().toISOString().split("T")[0] : "-"
                });
            }

            saveAnimals(animals);

            const modalInstance = bootstrap.Modal.getInstance(document.getElementById("animalModal"));
            if (modalInstance) modalInstance.hide();

            renderAnimalTable(searchInput ? searchInput.value : "", statusSelect ? statusSelect.value : "all");
            updateDashboardStatistics();
            animalForm.reset();
            document.getElementById("animalId").value = "";
        });
    }
});
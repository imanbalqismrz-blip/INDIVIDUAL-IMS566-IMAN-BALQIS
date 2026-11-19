function getChartAnimalData() {
    if (typeof getAnimals === "function") {
        return getAnimals();
    }
    const savedAnimals = localStorage.getItem("pawpulseAnimals");
    return savedAnimals ? JSON.parse(savedAnimals) : [];
}

function getAnimalStatusData() {
    const animals = getChartAnimalData();
    return [
        animals.filter(animal => animal.status === "available").length,
        animals.filter(animal => animal.status === "adopted").length,
        animals.filter(animal => animal.status === "unavailable").length
    ];
}

function getAnimalSpeciesData() {
    const animals = getChartAnimalData();
    const speciesCounts = {};
    animals.forEach(animal => {
        const species = animal.species || "Other";
        speciesCounts[species] = (speciesCounts[species] || 0) + 1;
    });

    return {
        labels: Object.keys(speciesCounts),
        values: Object.values(speciesCounts)
    };
}

function createAnimalStatusChart() {
    const canvas = document.getElementById("animalStatusChart");
    if (!canvas || typeof Chart === "undefined") return;
    const statusData = getAnimalStatusData();

    window.animalStatusChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["Available (12)", "Adopted (7)", "Unavailable (1)"],
            datasets: [{
                label: "Number of Animals",
                data: statusData,
                backgroundColor: ["#198754", "#0dcaf0", "#6c757d"],
                borderWidth: 2,
                borderColor: "#ffffff",
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" },
                title: { display: true, text: "Animal Status Distribution" }
            }
        }
    });
}

function createAnimalSpeciesChart() {
    const canvas = document.getElementById("animalSpeciesChart");
    if (!canvas || typeof Chart === "undefined") return;
    const speciesData = getAnimalSpeciesData();

    window.animalSpeciesChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: speciesData.labels,
            datasets: [{
                label: "Number of Animals",
                data: speciesData.values,
                backgroundColor: [
                    "#2aa471", "#fd7e14", "#b56f1f", "#d20e49",
                    "#d9dc3a", "#f387b8", "#dc3545", "#681080"
                ],
                borderRadius: 6,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Animals by Species" }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    createAnimalStatusChart();
    createAnimalSpeciesChart();
});
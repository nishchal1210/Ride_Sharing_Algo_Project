document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const rideForm = document.getElementById("ride-form");
    const rideSection = document.getElementById("ride-scheduling-section");
    const rideDetailsTab = document.getElementById("ride-details-tab");
    const rideDetailsContainer = document.getElementById("ride-details-container");
    let map;

    // Handle sign-up / login form submission
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Sign up / login successful!");
        document.getElementById("auth-section").style.display = "none";
        rideSection.style.display = "block";
        initMap(); // Initialize map after login
    });

    // Handle ride scheduling form submission
    rideForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const startLocation = { name: "Start", lat: 26.9124, lng: 75.7873 };
        const goalLocation = { name: "Destination", lat: 26.9500, lng: 75.8250 };

        // Generate 100 random locations for demonstration
        const locations = generateRandomLocations(startLocation, goalLocation, 100);

        // Find the shortest path using A* algorithm with a threshold distance to change riders
        const thresholdDistance = 10; // Distance threshold to change riders
        const path = findShortestPathAStar(startLocation, goalLocation, locations, thresholdDistance);

        if (path.length > 0) {
            plotPathOnMap(path);
            sendRideDetailsEmail(path);
        } else {
            alert("No path found between the locations.");
        }
    });

    // Initialize the map centered on Jaipur
    function initMap() {
        map = L.map('map').setView([26.9124, 75.7873], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }

    // Generate random locations around a base point
    function generateRandomLocations(start, goal, count) {
        const locations = [start];
        for (let i = 1; i <= count; i++) {
            const latOffset = (Math.random() - 0.5) * 0.1;
            const lngOffset = (Math.random() - 0.5) * 0.1;
            locations.push({
                name: `Location ${i}`,
                lat: start.lat + latOffset,
                lng: start.lng + lngOffset,
                rider: `Rider ${i % 10}`,
                color: getRandomColor()
            });
        }
        locations.push(goal);
        return locations;
    }

    // Utility to generate a random color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // A* algorithm to find the shortest path with rider switching
    function findShortestPathAStar(start, goal, locations, thresholdDistance) {
        let openSet = [start];
        let cameFrom = {};
        let gScore = {};
        let fScore = {};
        let totalDistanceTravelled = 0;
        let currentRider = start.rider || "Rider 1";

        locations.forEach(location => {
            gScore[location.name] = Infinity;
            fScore[location.name] = Infinity;
        });
        gScore[start.name] = 0;
        fScore[start.name] = heuristic(start, goal);

        while (openSet.length > 0) {
            let current = openSet.reduce((lowest, node) => {
                return fScore[node.name] < fScore[lowest.name] ? node : lowest;
            });

            if (current.name === goal.name) {
                return reconstructPath(cameFrom, current);
            }

            openSet = openSet.filter(node => node !== current);

            locations.forEach(neighbor => {
                if (neighbor === current) return;
                let tentative_gScore = gScore[current.name] + distance(current, neighbor);
                if (tentative_gScore < gScore[neighbor.name]) {
                    cameFrom[neighbor.name] = current;
                    gScore[neighbor.name] = tentative_gScore;
                    fScore[neighbor.name] = tentative_gScore + heuristic(neighbor, goal);
                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            });

            totalDistanceTravelled += distance(current, locations.find(loc => loc.name === cameFrom[current.name]?.name));
            if (totalDistanceTravelled >= thresholdDistance) {
                currentRider = `Rider ${Math.floor(Math.random() * 10) + 1}`;
                totalDistanceTravelled = 0;
            }
            current.rider = currentRider;
        }

        return [];
    }

    // Calculate the heuristic (Euclidean distance)
    function heuristic(a, b) {
        const dx = b.lat - a.lat;
        const dy = b.lng - a.lng;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Calculate the Euclidean distance
    function distance(a, b) {
        const dx = b.lat - a.lat;
        const dy = b.lng - a.lng;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Reconstruct the path
    function reconstructPath(cameFrom, current) {
        let totalPath = [current];
        while (cameFrom[current.name]) {
            current = cameFrom[current.name];
            totalPath.push(current);
        }
        return totalPath.reverse();
    }

    // Plot path on the map
    function plotPathOnMap(path) {
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });

        path.forEach((location, index) => {
            L.marker([location.lat, location.lng]).addTo(map).bindPopup(`Step ${index + 1}: ${location.name}`);
        });

        for (let i = 0; i < path.length - 1; i++) {
            L.polyline([[path[i].lat, path[i].lng], [path[i + 1].lat, path[i + 1].lng]], {
                color: path[i].color || 'blue',
                weight: 5
            }).addTo(map);
        }
    }

    // Send ride details via email (dummy function)
    function sendRideDetailsEmail(path) {
        const email = document.getElementById("email").value;
        let rideDetails = "Your ride details:\\n";
        path.forEach((location, index) => {
            rideDetails += `Step ${index + 1}: ${location.name} (Rider: ${location.rider})\\n`;
        });
        alert(`Ride details sent to ${email}:\\n${rideDetails}`);
    }
});

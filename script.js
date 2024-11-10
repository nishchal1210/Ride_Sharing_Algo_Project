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
        const startLocation = document.getElementById("start-location").value;
        const destination = document.getElementById("destination").value;
        const rideDate = document.getElementById("ride-date").value;

        // Dummy locations (in a real app, use geocoding services)
        const locations = [
            { name: "Start", lat: 26.9124, lng: 75.7873, rider: "Rider 1", color: "red" },
            { name: "Intermediate Point A", lat: 26.9250, lng: 75.8000, rider: "Rider 2", color: "blue" },
            { name: "Intermediate Point B", lat: 26.9390, lng: 75.8100, rider: "Rider 3", color: "green" },
            { name: "Destination", lat: 26.9500, lng: 75.8250 }
        ];

        // Clear existing markers and polylines only if map is initialized
        if (map) {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                    map.removeLayer(layer);
                }
            });
        }

        // Plot points and paths with different colors
        const riderInfoDiv = document.getElementById("rider-info");
        riderInfoDiv.innerHTML = ""; // Clear previous info
        for (let i = 0; i < locations.length - 1; i++) {
            const start = locations[i];
            const end = locations[i + 1];

            // Add markers
            L.marker([start.lat, start.lng]).addTo(map).bindPopup(`${start.name} (Start)`).openPopup();
            L.marker([end.lat, end.lng]).addTo(map).bindPopup(`${end.name} (End)`);

            // Draw polyline
            L.polyline([[start.lat, start.lng], [end.lat, end.lng]], {
                color: start.color,
                weight: 5
            }).addTo(map);

            // Add rider info box
            riderInfoDiv.innerHTML += `<p style="color:${start.color};"><strong>${start.rider}:</strong> Path from ${start.name} to ${end.name}</p>`;
        }

        // Open a new window for the ride details
        openRideDetailsInNewWindow(locations);
    });

    // Initialize the map centered on Jaipur
    function initMap() {
        if (map) {
            return; // If map is already initialized, do nothing
        }

        map = L.map('map').setView([26.9124, 75.7873], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }

    // Open a new window and display detailed ride information
    function openRideDetailsInNewWindow(locations) {
        const newWindow = window.open("", "Ride Details", "width=600,height=400");
        
        // Add HTML content to the new window
        newWindow.document.write(`
            <html>
                <head>
                    <title>Ride Details</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2 { color: #4CAF50; }
                        p { font-size: 16px; }
                        hr { margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <h2>Ride Details</h2>
                    <div id="ride-details-container"></div>
                    <script>
                        // Ride details content for the new window
                        const locations = ${JSON.stringify(locations)};
                        const avgSpeed = 40; // Assumed average speed in km/h
                        let totalFare = 0;
                        let totalDistance = 0;
                        const rideDetailsContainer = document.getElementById('ride-details-container');
                        
                        locations.forEach((location, index) => {
                            if (index < locations.length - 1) {
                                const distance = (Math.random() * 5 + 1); // Randomized distance between 1-5 km (for demo purposes)
                                const fare = distance * 10; // Example fare calculation
                                totalFare += fare;
                                totalDistance += distance;

                                rideDetailsContainer.innerHTML += \`
                                    <p>
                                        <strong>Rider:</strong> \${location.rider}<br>
                                        <strong>Distance:</strong> \${distance.toFixed(2)} km<br>
                                        <strong>Estimated Time:</strong> \${(distance / avgSpeed * 60).toFixed(2)} minutes<br>
                                        <strong>Fare:</strong> ₹\${fare.toFixed(2)}
                                    </p>
                                \`;
                            }
                        });

                        rideDetailsContainer.innerHTML += \`
                            <hr>
                            <p><strong>Total Distance:</strong> \${totalDistance.toFixed(2)} km</p>
                            <p><strong>Total Fare:</strong> ₹\${totalFare.toFixed(2)}</p>
                        \`;
                    </script>
                </body>
            </html>
        `);

        newWindow.document.close(); // Close the document to render content properly
    }
});

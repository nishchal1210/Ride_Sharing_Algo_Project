#include <iostream>
#include <vector>
#include <cmath>   // For sqrt and pow
#include <limits>  // For numeric_limits

using namespace std;

// Structure to represent a point (either a driver or passenger location)
struct Point {
    int id;      // Unique identifier for the driver or passenger
    double x, y; // Coordinates of the driver or passenger
};

// Class to represent the Ride Sharing Problem
class RideSharingProblem {
public:
    vector<Point>& drivers;
    vector<Point>& passengers;
    vector<bool> driverAssigned; // Keeps track of assigned drivers
    
    // Constructor to initialize problem
    RideSharingProblem(vector<Point>& d, vector<Point>& p) 
        : drivers(d), passengers(p), driverAssigned(d.size(), false) {}
    
    // Function to calculate the Euclidean distance between two points
    double calculateDistance(Point a, Point b) {
        return sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2));
    }
    
    // Check if all passengers have been assigned
    bool isComplete(int assignedPassengers) {
        return assignedPassengers == passengers.size();
    }

    // Find the best choice of driver for a given passenger
    int findBestChoice(Point& passenger) {
        double minDistance = numeric_limits<double>::max();
        int bestDriverIndex = -1;

        // Loop over all drivers to find the closest available one
        for (int i = 0; i < drivers.size(); i++) {
            if (!driverAssigned[i]) {  // Only consider unassigned drivers
                double distance = calculateDistance(passenger, drivers[i]);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestDriverIndex = i;
                }
            }
        }
        return bestDriverIndex;
    }
    
    // Check if the selected driver is valid (in this case, the check is implicit)
    bool isValidChoice(int driverIndex) {
        return driverIndex != -1;
    }
    
    // Update the problem state by marking the driver as assigned
    void updateProblem(int driverIndex) {
        driverAssigned[driverIndex] = true;
    }
};

// Greedy Algorithm for Ride Sharing
void rideSharingGreedy(RideSharingProblem& problem) {
    int assignedPassengers = 0;
    
    // Loop through all passengers and assign the best driver to each one
    for (Point& passenger : problem.passengers) {
        int bestDriverIndex = problem.findBestChoice(passenger); // Find the nearest driver
        
        if (problem.isValidChoice(bestDriverIndex)) {  // Check if a valid driver is found
            cout << "Passenger " << passenger.id << " is assigned to Driver " 
                 << problem.drivers[bestDriverIndex].id << " with distance: " 
                 << problem.calculateDistance(passenger, problem.drivers[bestDriverIndex]) << endl;
            
            problem.updateProblem(bestDriverIndex);  // Mark the driver as assigned
            assignedPassengers++;
        } else {
            cout << "No available driver for Passenger " << passenger.id << endl;
        }

        if (problem.isComplete(assignedPassengers)) {
            break;  // Exit if all passengers are assigned
        }
    }
}

int main() {
    int numDrivers, numPassengers;
    
    // Input number of drivers
    cout << "Enter number of drivers: ";
    cin >> numDrivers;

    // Input number of passengers
    cout << "Enter number of passengers: ";
    cin >> numPassengers;

    vector<Point> drivers(numDrivers);
    vector<Point> passengers(numPassengers);

    // Input coordinates for drivers
    cout << "Enter coordinates (x y) for each driver:" << endl;
    for (int i = 0; i < numDrivers; i++) {
        cout << "Driver " << i + 1 << " (id = " << i + 1 << "): ";
        cin >> drivers[i].x >> drivers[i].y;
        drivers[i].id = i + 1;  // Assign unique id
    }

    // Input coordinates for passengers
    cout << "Enter coordinates (x y) for each passenger:" << endl;
    for (int i = 0; i < numPassengers; i++) {
        cout << "Passenger " << i + 1 << " (id = " << i + 1 << "): ";
        cin >> passengers[i].x >> passengers[i].y;
        passengers[i].id = i + 1;  // Assign unique id
    }

    // Create the problem instance
    RideSharingProblem problem(drivers, passengers);
    
    // Run the greedy algorithm to match drivers and passengers
    rideSharingGreedy(problem);

    return 0;
}

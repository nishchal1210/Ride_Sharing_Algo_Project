#include <iostream>
#include <vector>
#include <limits>
#include <queue>
#include <cmath>
#include <algorithm>

using namespace std;

// Constants
const int INF = numeric_limits<int>::max();
const int MAX_DRIVERS = 100;
const int MAX_PASSENGERS = 100;

// Structure for Location
struct Location {
    double x, y;
    
    double distance(const Location& other) const {
        return sqrt((x - other.x) * (x - other.x) + (y - other.y) * (y - other.y));
    }
};

// Driver structure
struct Driver {
    int id;
    Location location;
    bool available;
};

// Passenger structure
struct Passenger {
    int id;
    Location location;
    Location destination;
    bool assigned;
};

// Hungarian Algorithm for assignment
class HungarianAlgorithm {
private:
    int n; // Number of drivers/passengers
    vector<vector<double>> costMatrix;
    vector<int> assigned;

public:
    HungarianAlgorithm(int n) : n(n), costMatrix(n, vector<double>(n, INF)), assigned(n, -1) {}

    void setCost(int driverIndex, int passengerIndex, double cost) {
        costMatrix[driverIndex][passengerIndex] = cost;
    }

    double minimizeCost() {
        // Vectors for labeling
        vector<double> u(n, 0), v(n, 0);
        vector<int> p(n, -1), way(n, -1);
        vector<double> minv(n);
        vector<bool> used(n);

        // Main Hungarian algorithm loop
        for (int i = 0; i < n; ++i) {
            fill(minv.begin(), minv.end(), INF);
            fill(used.begin(), used.end(), false);
            int j0 = 0;
            p[0] = i;
            do {
                used[j0] = true;
                int i0 = p[j0], j1 = -1;
                double delta = INF;
                for (int j = 1; j < n; ++j) {
                    if (!used[j]) {
                        double cur = costMatrix[i0][j] - u[i0] - v[j];
                        if (cur < minv[j]) {
                            minv[j] = cur;
                            way[j] = j0;
                        }
                        if (minv[j] < delta) {
                            delta = minv[j];
                            j1 = j;
                        }
                    }
                }
                for (int j = 0; j < n; ++j) {
                    if (used[j]) {
                        u[p[j]] += delta;
                        v[j] -= delta;
                    } else {
                        minv[j] -= delta;
                    }
                }
                j0 = j1;
            } while (p[j0] != -1);
            
            // Augmenting path
            do {
                int j1 = way[j0];
                p[j0] = p[j1];
                j0 = j1;
            } while (j0);
        }

        assigned = vector<int>(n);
        for (int j = 0; j < n; ++j) {
            assigned[p[j]] = j;
        }
        return -v[0];
    }

    vector<int> getAssigned() {
        return assigned;
    }
};

// Function to assign drivers to passengers
void assignDrivers(vector<Driver>& drivers, vector<Passenger>& passengers) {
    int n = min(drivers.size(), passengers.size());

    // Initialize Hungarian algorithm for matching
    HungarianAlgorithm hungarian(n);

    // Set up the cost matrix (distance-based)
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            double dist = drivers[i].location.distance(passengers[j].location);
            hungarian.setCost(i, j, dist);
        }
    }

    // Minimize cost and get assignment
    hungarian.minimizeCost();
    vector<int> assigned = hungarian.getAssigned();

    // Output the assignment
    for (int i = 0; i < n; ++i) {
        int passengerId = assigned[i];
        cout << "Driver " << drivers[i].id << " assigned to Passenger " << passengers[passengerId].id << endl;
    }
}

// Main simulation loop
void simulateRideSharing() {
    // Example drivers and passengers
    vector<Driver> drivers = {
        {1, {0, 0}, true},
        {2, {1, 1}, true},
        {3, {2, 2}, true}
    };

    vector<Passenger> passengers = {
        {1, {0, 1}, {5, 5}, false},
        {2, {2, 1}, {6, 6}, false},
        {3, {3, 3}, {7, 7}, false}
    };

    // Assign drivers to passengers
    assignDrivers(drivers, passengers);

    // After assignment, drivers move towards their passengers' destinations
    // Simulate real-time updates, reassign if needed
}

int main() {
    simulateRideSharing();
    return 0;
}

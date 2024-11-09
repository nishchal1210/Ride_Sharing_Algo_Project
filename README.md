# OptiRide : An Optimized Ride Scheduler

## Overview
**OptiRide** is a modern day optimized ride scheduler 

## Code Structure
- **main.cpp** : Contains the implementation of the A* algorithm and a sample grid setup.
- **PriorityQueue Class** : A wrapper for the min-heap priority queue.
- **cell Structure** : Stores details of each cell, including coordinates of the parent cell and f, g, h values.

## Algorithm Explanation
This project implements the A* search algorithm in C++ to find the shortest path from a source to a destination on a 2D grid. The grid represents an environment with walkable and blocked cells, making this algorithm suitable for applications like pathfinding in robotics, games, and navigation systems.

The A* algorithm is a popular choice for pathfinding as it combines both path cost and heuristic estimation, leading to an efficient and optimal solution. This implementation utilizes several data structures to manage and prioritize nodes during the search.

The A* algorithm finds the shortest path by maintaining an `f` score for each cell:
- `f = g + h`
  - `g` is the exact cost from the start cell to the current cell.
  - `h` is the heuristic estimate from the current cell to the destination.

The algorithm explores nodes with the lowest `f` score, optimizing the search towards the destination and achieving the shortest path.

### Features
- **2D Grid Environment**: Represents the map as a grid, where each cell can be walkable or blocked.
- **Priority-Based Node Expansion**: Uses a min-heap priority queue to select the cell with the minimum estimated cost to the goal.
- **Optimal Path Guarantee**: Given an admissible heuristic, the algorithm ensures the shortest path from the source to the destination.
- **Path Backtracking**: Stores and retrieves the path from the destination to the source.


## Data Structures
1. **2D Grid (`grid`)**: Represents the environment as a `vector<vector<int>>` to manage walkable and blocked cells.
2. **Priority Queue**: A min-heap using `vector<pair<double, Pair>>` for efficient node expansion based on the lowest `f` cost.
3. **Closed List**: A 2D `vector<vector<bool>>` to track visited cells, preventing re-processing.
4. **Cell Details**: A 2D array of `cell` structs to store details of each cell, including parent cell coordinates and `f`, `g`, `h` values.
5. **Path Stack**: A `stack<Pair>` to trace the path back from the destination to the source.

## Directions to Run the Code 
- Follow the given protocols in correct order :-
- 1. 

## Usage

### Requirements
- C++ compiler (GCC, Clang, or Visual Studio)
- Standard C++ library support


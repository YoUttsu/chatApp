var minimumDistance = function(coordinates) {
    let maxDistance = -1;
    let maxPairs = [];

    // Find all pairs of points that lead to the maximum distance
    for (let i = 0; i < coordinates.length; i++) {
        for (let j = i + 1; j < coordinates.length; j++) {
            const distance = Math.abs(coordinates[i][0] - coordinates[j][0]) +
                             Math.abs(coordinates[i][1] - coordinates[j][1]);

            if (distance > maxDistance) {
                maxDistance = distance;
                maxPairs = [[coordinates[i], coordinates[j]]];
            } else if (distance === maxDistance) {
                maxPairs.push([coordinates[i], coordinates[j]]);
            }
        }
    }

    let minMaxDistance = Infinity;

    // For each pair, compute maximum distance after removing one point
    for (const pair of maxPairs) {
        for (const point of pair) {
            let maxDistanceAfterRemoval = -1;
            for (const otherPoint of coordinates) {
                if (otherPoint !== point) {
                    const distance = Math.abs(pair[0][0] - otherPoint[0]) +
                                     Math.abs(pair[0][1] - otherPoint[1]);
                    maxDistanceAfterRemoval = Math.max(maxDistanceAfterRemoval, distance);
                }
            }
            minMaxDistance = Math.min(minMaxDistance, maxDistanceAfterRemoval);
        }
    }

    return minMaxDistance;
};

// Test coordinates
const coordinates = [[1,1],[7,3],[5,9],[6,4],[7,6],[6,4],[5,2],[4,2],[7,2],[1,1]];

// Minimum possible value for maximum distance between any two points after removing exactly one point
console.log(minimumDistance(coordinates)); // Output: 12

import { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function LocationList() {
  const [locations, setLocations] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    if (locations.length < 2) {
      Alert.alert('Validation', 'Please add at least two locations.');
      return;
    }

    const processedResult = processLocations(locations);
    setResult(processedResult);
  }, [locations]);

  const addLocation = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      Alert.alert('Validation', 'Please enter a valid location.');
      return;
    }
    if (locations.includes(trimmed)) {
      Alert.alert('Duplicate', 'Location already exists.');
      return;
    }
    setLocations(prev => [...prev, trimmed]);
    setInputValue('');
  };


  // Function to remove an item
  const removeLocation = (location: string) => {
    setLocations(prev => prev.filter(loc => loc !== location));
  };

  // Function to clear the list
  const clearList = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to clear the list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => setLocations([]) },
      ]
    );
  };

  // Render each list item
  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemText}>{item}</Text>
      <Button title="Remove" onPress={() => removeLocation(item)} />
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Stored List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Button title="Add" onPress={addLocation} />
      </View>

      <FlatList
        data={locations}
        keyExtractor={(location, index) => `${location}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={
           <Text style={styles.emptyText}>No locations yet.</Text>
        }
      />
      <Text style={styles.title}>Minimum Time to Visit All Locations: {result !== null ? result : 'N/A'}</Text>

      {locations.length > 0 && (
        <Button title="Clear List" color="red" onPress={clearList} />
      )}
    </View>
  );
};

function processLocations(Locations: string[] ) {
    var graph: number[][] = [];
    for (let i = 0; i < Locations.length; i++) {
        graph.push(Locations[i].split(',').map(part => part.trim()).map(Number));
    }
    return minimizeTime(graph);
}

  function minimizeTime(graph: number[][]): number {
    console.log('Graph:', graph);
    var nodes = new Set<number>();
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            nodes.add(graph[i][j]);
        }
    }
      var n = graph.length;
      if (nodes.size > n) {
            
          return -1;
      }

      // Create adjacency list from the given graph
      var adj: number[][] = [];
      for(var i=0;i<n;i++){
          adj.push([]);
          for(var j=0;j<graph[i].length;j++){
              adj[i].push(graph[i][j]);
          }
      }

      // Final mask when all the node will be visited
      var finalMask = (1<<n) - 1;

      console.log('finalMask:', finalMask);

      // Initialize a queue for BFS which will store current
      // node id and mask of visited nodes.
      var q = [];

      // Initialize a visited array for keeping track
      // of all mask that are visited in the path
      var visited: number[][] = [];
      for(var i=0;i<n;i++){
          visited.push([]);
          for(var j=0;j<=finalMask;j++){
              visited[i].push(0);
          }
      }

      // Push starting node for
      // all possible path with their mask
      for(var i=0;i<n;i++){
          q.push([i,1<<i]);
      }

      // For counting the minimum time
      // to visit all the nodes
      var timeCount = 0;

       // Do while q.size > 0
      while(q.length > 0){
          var size = q.length;

          // Iterate over each level
          for(var i=0;i<size;i++){

              // Fetch and pop the current node
              var curr: number[] = q.shift()!;

              // Check if the current node mask
              // is equal to finalMask
              if(curr[1] == finalMask){
                  return timeCount;
              }

              // Explore all the child of current node
              for(var j=0;j<adj[curr[0]].length;j++){
                  var child: number = adj[curr[0]][j];

                  // Make a new Mask for child
                  var newVisitedBit = curr[1]|(1<<child);

                  // If new Mask for child has
                  // not been visited yet,
                  // push child and new Mask in
                  // the queue and mark visited
                  // for child with newVisitedBit
                  console.log(visited);
                  if(visited[child][newVisitedBit] == 0){
                      q.push([child,newVisitedBit]);
                      visited[child][newVisitedBit] = 1;
                  }
              }
          }

          // Increment the time Count after each level
          timeCount = timeCount + 1;
      }
      // If all node can't be visited
      return -1;
  }

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  inputRow: { flexDirection: 'row', marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: { fontSize: 16 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
});
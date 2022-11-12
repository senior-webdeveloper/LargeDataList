/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  TextInput,
} from 'react-native';
import _ from 'lodash';
import pets from './assets/data.json';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const App = () => {
  const [columns, setColumns] = useState([
    'S.No',
    'Account ID',
    'Account Name',
    'Account Type',
    'Specialty 1',
    'Province',
    'Parent Account Id',
    'Parent Account Name',
    'PSR Id',
    'PSR Name',
    'FLSM Id',
    'FLSM Name',
    'NSM Id',
    'NSM Name',
    'Q1: How many diagnosed OP patients per month?',
    'Q2:How many patients are treated for OP on an average per month?',
    'Q3:What percentage treated of your OP-treated patients are currently being prescribed Drug A?',
  ]);
  const [widthArr, setWithArr] = useState({
    'S.No': 80,
    'Account ID': 100,
    'Account Name': 150,
    'Account Type': 120,
    'Specialty 1': 100,
    Province: 100,
    'Parent Account Id': 120,
    'Parent Account Name': 140,
    'PSR Id': 100,
    'PSR Name': 100,
    'FLSM Id': 100,
    'FLSM Name': 100,
    'NSM Id': 100,
    'NSM Name': 100,
    'Q1: How many diagnosed OP patients per month?': 180,
    'Q2:How many patients are treated for OP on an average per month?': 180,
    'Q3:What percentage treated of your OP-treated patients are currently being prescribed Drug A?': 180,
  });
  const [filters, setFilters] = useState({});
  const [direction, setDirection] = useState(null);
  const [rows, setRows] = useState(pets.slice(0, 20));
  const [filteredRows, setFilteredRows] = useState(pets.slice(0, 20));

  const sortTable = column => {
    const newDirection = direction === 'desc' ? 'asc' : 'desc';
    const sortedData = _.orderBy(filteredRows, [column], [newDirection]);

    setDirection(newDirection);
    setFilteredRows(sortedData);
  };

  const searchFilterFunction = (text, column) => {
    if (text) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [column]: text,
      }));
    } else {
      // column
      setFilters(prevFilters => {
        const updatedFilters = {...prevFilters};
        delete updatedFilters[column];

        return updatedFilters;
      });
    }
  };

  const editItemHandler = (rowKey, columnName, value) => {
    rows.filter(item => {
      if (item['S.No'] == rowKey) {
        item[columnName] = value;
      }
    });
    setRows(rows);
    setFilteredRows(rows);
  };

  // filter data
  useEffect(() => {
    if (_.isEmpty(filters)) {
      setFilteredRows(rows);
    } else {
      const newData = rows.filter(row => {
        return Object.keys(filters).every(accessor => {
          const value = row[accessor];
          const searchValue = filters[accessor];

          if (_.isString(value)) {
            const itemData = value ? value.toUpperCase() : ''.toUpperCase();
            const textData = searchValue.toUpperCase();

            return itemData.indexOf(textData) > -1;
          }

          if (_.isBoolean(value)) {
            return (
              (searchValue === 'true' && value) ||
              (searchValue === 'false' && !value)
            );
          }

          if (_.isNumber(value)) {
            return value == searchValue;
          }

          return false;
        });
      });

      setFilteredRows(newData);
    }
  }, [filters]);

  const TableHeader = () => (
    <View style={styles.TableHeader}>
      {columns.map((column, index) => {
        {
          return (
            <View key={index}>
              <TouchableOpacity
                style={styles.columnHeader}
                onPress={() => sortTable(column)}>
                <Text
                  style={{
                    padding: 5,
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    width: widthArr[column],
                  }}>
                  {column + ' '}
                </Text>
              </TouchableOpacity>
              <TextInput
                key={index}
                style={styles.textInputStyle}
                onChangeText={text => searchFilterFunction(text, column)}
                value={filters[column]}
                underlineColorAndroid="transparent"
              />
            </View>
          );
        }
      })}
    </View>
  );

  const TableBody = props => {
    const [text, setText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const itemPress = () => {
      setIsEditing(true);
      setText(props.columnValue);
    };

    const saveItem = () => {
      setIsEditing(false);
      editItemHandler(props.rowKey, props.columnName, text);
      setText('');
    };

    return (
      <View style={{width: widthArr[props.columnName]}}>
        {isEditing &&
        props.columnName != 'S.No' &&
        props.columnName != 'Account ID' ? (
          <TextInput
            value={text}
            style={styles.textInputStyle}
            onChangeText={setText}
            onBlur={() => saveItem()}
          />
        ) : (
          <TouchableHighlight underlayColor="white" onPress={() => itemPress()}>
            <Text style={{textAlign: 'center', padding: 5}}>
              {props.columnValue}
            </Text>
          </TouchableHighlight>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal={true}>
        <FlatList
          data={filteredRows}
          keyExtractor={(item, index) => index + ''}
          ListHeaderComponent={TableHeader}
          stickyHeaderIndices={[0]}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  ...styles.tableRow,
                  flexGrow: 1,
                  backgroundColor: index % 2 == 1 ? '#F0FBFC' : 'white',
                }}>
                {columns.map((column, index) => {
                  {
                    return (
                      <View key={index}>
                        <TableBody
                          rowKey={item['S.No']}
                          columnValue={item[column]}
                          columnName={column}
                        />
                      </View>
                    );
                  }
                })}
              </View>
            );
          }}
        />
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  textItem: {
    height: 30,
    borderWidth: 1,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  TableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#37C2D0',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 80,
  },
  tableRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  columnHeader: {
    // width: '20%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnHeaderTxt: {
    // padding: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  columnRowTxt: {
    // width: '20%',
    textAlign: 'center',
  },
});

export default App;

import 'package:flutter/material.dart';
import 'src/models/Task.dart';
import 'src/screens/task_card.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    /// MaterialApp is the base Widget for your Flutter Application
    /// Gives us access to routing, context, and meta info functionality.
    return MaterialApp(
      title: 'Zatlapp',
      theme: ThemeData(brightness: Brightness.dark),
      home: MyHomePage(title:'Zatlapp')

    );
  }
}

class MyHomePage extends StatefulWidget{
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  List<Task> initialTasks = []
    ..add(Task('Hert gaan', 'ZUIPEN IS LEUK EN ZUIPEN IS TOF KOMAAN MANNEN WE GAAN ERVOOT'))
    ..add(Task('Oei wat nu', 'ZUIPEN IS LEUK EN ZUIPEN IS TOF KOMAAN MANNEN WE GAAN ERVOOT'))
    ..add(Task('Probeer nog een keer', 'ZUIPEN IS LEUK EN ZUIPEN IS TOF KOMAAN MANNEN WE GAAN ERVOOT'))
    ..add(Task('HMMMM BIER', 'ZUIPEN IS LEUK EN ZUIPEN IS TOF KOMAAN MANNEN WE GAAN ERVOOT'))
    ..add(Task('SEG PALJAS', 'ZUIPEN IS LEUK EN ZUIPEN IS TOF KOMAAN MANNEN WE GAAN ERVOOT'));


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.black87,
      ),
      body: Container(
        child: TaskCard(initialTasks[1]), // New code
      ),
    );
  }



}
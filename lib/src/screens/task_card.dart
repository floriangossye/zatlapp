import 'package:flutter/material.dart';

import '../models/Task.dart';

class TaskCard extends StatefulWidget {
  final Task task;

  TaskCard(this.task);

  @override
  _TaskCardState createState() => _TaskCardState(task);
}

class _TaskCardState extends State<TaskCard> {
  void initState() {
    super.initState();
    renderDogPic();
  }

// IRL, we'd want the Dog class itself to get the image
// but this is a simpler way to explain Flutter basics
  void renderDogPic() async {
    // this makes the service call
    await task.getImageUrl();
    // setState tells Flutter to rerender anything that's been changed.
    // setState cannot be async, so we use a variable that can be overwritten
    if (mounted) { // Avoid calling `setState` if the widget is no longer in the widget tree.
      setState(() {
        renderUrl = task.imageUrl;
      });
    }
  }
  
  Task task;

  _TaskCardState(this.task);

  @override
  Widget build(BuildContext context) {
    return Text(widget.task.title);
  }
}

String renderUrl;

Widget get taskImage {
  return Container(
    // You can explicitly set heights and widths on Containers.
    // Otherwise they take up as much space as their children.
    width: 100.0,
    height: 100.0,
    // Decoration is a property that lets you style the container.
    // It expects a BoxDecoration.
    decoration: BoxDecoration(
      // BoxDecorations have many possible properties.
      // Using BoxShape with a background image is the
      // easiest way to make a circle cropped avatar style image.
      shape: BoxShape.circle,
      image: DecorationImage(
        // Just like CSS's `imagesize` property.
        fit: BoxFit.cover,
        // A NetworkImage widget is a widget that
        // takes a URL to an image.
        // ImageProviders (such as NetworkImage) are ideal
        // when your image needs to be loaded or can change.
        // Use the null check to avoid an error.
        image: NetworkImage(renderUrl ?? ''),
      ),
    ),
  );
}
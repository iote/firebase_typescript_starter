Firebase Functions + Typescript Starter -
-----------------------------------------

This project is a handy, SOLID, implementation of how Firebase Cloud Functions can be combined with Typescript to create an effective, scalable and most importantly maintainable backend using Cloud Functions.

The library hides the strong dependencies on firebase available in the API so the developer can focus on the for him most important, implementation logic.

Next to this, the library also nicely seperates concerns so the code is maintainable and easy to test.

The project is split into src/base and src/modules:

--  Base
Base contains the abstractions (such as registring a function onto firebase, working with firestore, etc.) and inner workings of the framework.

-- Modules
Modules allow one to seperate distinct parts of their application into several modules. Functionality can be grouped in this way.

Modules have several functions, that contain only the logic of those functions. All interactions with Firebase are abstracted away in the framework. Functions can be registered by creating a new GCFunction that takes in different parts (registration, guards, logic, after-effects) and can then be built into a function.

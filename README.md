# CommandLineDeliveryApplications

This is a command-line application built with Node.js that allows users to calculate the delivery cost and time for a package. The application takes in the following inputs:

- Base delivery cost
- Package amount
- Package details
- Delivery speed
- Vehicle carry weight

That outputs the calculated delivery cost and delivery time.

## Requirements

To run this project, you need to have Node.js installed on your computer. If you encounter a `command not found` or `node is not recognized as an internal or external command` error, you can download and install Node.js from the official website at `https://nodejs.org/en/download`.

## How to run

To run this application, open your terminal and navigate to the root directory of the project. From there, you can use the following commands:

- `npm test`: runs all the defined test cases in tests/testCases.js.
- `npm run verify-cost-calculation`: runs the command to test the first problem, which calculates the delivery cost only.
- `npm run verify-cost-and-time-calculation`: runs the command to test the second problem, which calculates the delivery cost and time.
- `npm run verify-double-offer-codes-both-invalid`: runs the command to verify both invalid offer codes.
- `npm run verify-double-offer-codes-mixed-validity`: runs the command to verify mixed-validity offer codes.
- `npm run verify-no-offer-code`: runs the command to verify no offer code.
- `npm start`: accepts custom inputs for other related logic.

I hope you find this application useful! If you encounter any issues or have any questions, please feel free to contact me at keannenglim@gmail.com.

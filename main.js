const { offers } = require("./model/offer");
const { packageService } = require("./model/package");
const { inputHandler } = require("./utils/inputHandler");
const { consolePrinter, colorCodeEnum } = require("./utils/consolePrinter");

const readline = require("readline");
const { deliveryService } = require("./model/delivery");
process.stdin.setRawMode(false); // This line handles special characters/escapes etc.

const processEnum = {
    inputStartCommand: 0,
    inputBaseDeliveryCost: 1,
    inputPackageAmount: 2,
    inputPackageDetails: 3,
    inputVehicleAmount: 4,
    inputVehicleMaxSpeed: 5,
    inputVehicleMaxCarryWeight: 6,
    resultOutput: 7,
};

const verifyStartCommand = (input, readlineInstance, step) => {
    if (input === "start") {
        consolePrinter.print(
            `The ${input} command has been accepted!`,
            colorCodeEnum.green
        );
        consolePrinter.print(
            "Please enter the base delivery cost (the flat rate that will be applied to each package):",
            colorCodeEnum.brightBlue
        );
        step.value = processEnum.inputBaseDeliveryCost;
        readlineInstance.prompt();
    } else {
        consolePrinter.print(
            `Invalid command. Please enter a valid command.`,
            colorCodeEnum.red
        );
        consolePrinter.print(
            'To begin, input the "start" command (without double-quotes) and press the "Enter" or "Return" key.',
            colorCodeEnum.green
        );
        readlineInstance.prompt();
    }
};

const handleBaseDeliveryCost = (input, readlineInterface, step, delivery) => {
    const currentInputName = "base delivery cost";
    const validatedDeliveryCost = inputHandler.validateFloatInput(
        currentInputName,
        input
    );

    if (typeof validatedDeliveryCost !== "string") {
        delivery.setBaseDeliveryCost(validatedDeliveryCost);
        consolePrinter.print(
            `The ${currentInputName} is ${delivery.getBaseDeliveryCost()}.`,
            colorCodeEnum.green
        );
        consolePrinter.print(
            `Please enter the number of packages:`,
            colorCodeEnum.brightBlue
        );
        step.value = processEnum.inputPackageAmount;
        readlineInterface.prompt();
    } else {
        consolePrinter.print(
            "Please enter a base delivery cost (the flat cost that will be applied to each of the package(s)",
            colorCodeEnum.brightBlue
        );
        readlineInterface.prompt();
    }
};

const handlePackageAmount = (input, readlineInterface, step, delivery) => {
    const currentInputName = "package amount";
    validatedPackageAmount = inputHandler.validateIntegerInput(
        currentInputName,
        input
    );

    if (typeof validatedPackageAmount !== "string") {
        delivery.setPackageAmount(validatedPackageAmount);
        consolePrinter.print(
            `The ${currentInputName} is ${delivery.getPackageAmount()}.`,
            colorCodeEnum.green
        );
        consolePrinter.print(
            "Please enter the package details in the following format: 'package name', 'weight', 'distance', 'offer code(s)'.",
            colorCodeEnum.brightBlue
        );
        consolePrinter.print(
            "For example: 'PKG1 5 5 OFR001 PKG2 15 5 OFR002 PKG3 10 100 OFR003'.",
            colorCodeEnum.green
        );
        step.value = processEnum.inputPackageDetails;
        readlineInterface.prompt();
    } else {
        consolePrinter.print(
            `Please enter the number of packages:`,
            colorCodeEnum.brightBlue
        );
    }
};

const handlePackageDetails = (input, readlineInterface, step, delivery) => {
    const packageDetails = input.split(" ");
    const inputGeneratedPackages = packageService.generatePackages(
        delivery.getPackageAmount(),
        packageDetails
    );
    const packages = [];
    inputGeneratedPackages.forEach((package) => {
        packages.push(package);
        consolePrinter.print(
            `The package with package name ${package.id} has been added`,
            colorCodeEnum.cyan
        );
    });
    delivery.setPackages(packages);
    consolePrinter.print(
        "Enter 'cost' to calculate the cost or 'add' to include vehicle information and estimate both cost and time.",
        colorCodeEnum.brightBlue
    );
    step.value = processEnum.inputVehicleAmount;
    readlineInterface.prompt();
};

const handleVehicleAmount = (input, readlineInterface, step, delivery) => {
    if (input === "cost") {
        consolePrinter.print(
            "You are now in the cost calculation module.",
            colorCodeEnum.brightBlue
        );
        delivery.outputPackage();
        consolePrinter.print(
            "Enter 'add' to include vehicle information and estimate both cost and time, or 'quit' to exit the application.",
            colorCodeEnum.brightBlue
        );
    } else if (input === "add") {
        consolePrinter.print(
            `Please enter the number of vehicles:`,
            colorCodeEnum.brightBlue
        );
        step.value = processEnum.inputVehicleMaxSpeed;
        readlineInterface.prompt();
    } else if (input === "quit") {
        consolePrinter.print(
            `Shutting down the application.`,
            colorCodeEnum.red
        );
        readlineInterface.close();
    }
};

const handleVehicleMaxSpeed = (input, readlineInterface, step, delivery) => {
    const currentInputName = "vehicle amount";
    const validatedVehicleAmount = inputHandler.validateIntegerInput(
        currentInputName,
        input
    );
    if (typeof validatedVehicleAmount !== "string") {
        delivery.setVehicleAmount(validatedVehicleAmount);
        consolePrinter.print(
            `The ${currentInputName} is ${delivery.getVehicleAmount()}.`,
            colorCodeEnum.green
        );
        consolePrinter.print(
            `Please enter the vehicle max speed.`,
            colorCodeEnum.brightBlue
        );
        step.value = processEnum.inputVehicleMaxCarryWeight;
        readlineInterface.prompt();
    } else {
        consolePrinter.print(
            `Please enter the vehicle amount.`,
            colorCodeEnum.brightBlue
        );
    }
};

const handleVehicleMaxCarryWeight = (
    input,
    readlineInterface,
    step,
    delivery
) => {
    const currentInputName = "vehicle max speed";
    const validatedVehicleMaxSpeed = inputHandler.validateIntegerInput(
        currentInputName,
        input
    );

    if (typeof validatedVehicleMaxSpeed !== "string") {
        delivery.setVehicleMaxSpeed(validatedVehicleMaxSpeed);
        consolePrinter.print(
            `The ${currentInputName} is ${delivery.getVehicleMaxSpeed()}.`,
            colorCodeEnum.green
        );
        consolePrinter.print(
            `Please enter the vehicle max carry weight.`,
            colorCodeEnum.brightBlue
        );
        step.value = processEnum.resultOutput;
        readlineInterface.prompt();
    } else {
        consolePrinter.print(
            `Please enter the vehicle max speed.`,
            colorCodeEnum.brightBlue
        );
    }
};

const handleResultOutput = (input, readlineInterface, step, delivery) => {
    const currentInputName = "vehicle max carry weight";
    const validatedMaxCarryWeight = inputHandler.validateIntegerInput(
        currentInputName,
        input
    );

    if (typeof validatedMaxCarryWeight !== "string") {
        delivery.setVehicleMaxCarryWeight(validatedMaxCarryWeight);
        consolePrinter.print(
            `The ${currentInputName} is ${delivery.getVehicleMaxCarryWeight()}.`,
            colorCodeEnum.green
        );

        consolePrinter.print(
            `Start delivering packages!`,
            colorCodeEnum.magenta
        );

        delivery.calculateDeliveredPackages();
        delivery.outputPackage();
        readlineInterface.close();
    } else {
        consolePrinter.print(
            `Please enter the vehicle max carry weight.`,
            colorCodeEnum.brightBlue
        );
    }
};

try {
    // Begin with introduction
    consolePrinter.print(
        "Welcome to the delivery cost and time estimation system! To begin, please input the 'start' command and press 'Enter' or 'Return'.",
        colorCodeEnum.magenta
    );

    const mainDelivery = deliveryService.createDelivery();

    // Initializes the line-by-line user interaction
    let step = { value: 0 };

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    rl.on("line", async (line) => {
        let input = line.trim();
        switch (step.value) {
            case processEnum.inputStartCommand:
                verifyStartCommand(input, rl, step);
                break;

            case processEnum.inputBaseDeliveryCost:
                handleBaseDeliveryCost(input, rl, step, mainDelivery);
                break;

            case processEnum.inputPackageAmount:
                handlePackageAmount(input, rl, step, mainDelivery);
                break;

            case processEnum.inputPackageDetails:
                handlePackageDetails(input, rl, step, mainDelivery);
                break;

            case processEnum.inputVehicleAmount:
                handleVehicleAmount(input, rl, step, mainDelivery);
                break;

            case processEnum.inputVehicleMaxSpeed:
                handleVehicleMaxSpeed(input, rl, step, mainDelivery);
                break;

            case processEnum.inputVehicleMaxCarryWeight:
                handleVehicleMaxCarryWeight(input, rl, step, mainDelivery);
                break;

            case processEnum.resultOutput:
                handleResultOutput(input, rl, step, mainDelivery);
                break;
        }
    });

    rl.prompt();
} catch (error) {
    consolePrinter.print(error, colorCodeEnum.red);
}

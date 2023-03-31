const { packageService } = require("./model/package");
const { inputValidator } = require("./utils/inputValidator");
const { consolePrinter, colorCodeEnum } = require("./utils/consolePrinter");

const readline = require("readline");
const { deliveryService } = require("./model/delivery");
process.stdin.setRawMode(false); // This line handles special characters/escapes etc.

const processEnum = {
    inputStartCommand: 0,
    inputBaseDeliveryCost: 1,
    inputPackageAmount: 2,
    inputPackageDetails: 3,
    inputProcessFlow: 4,
    inputVehicleAmount: 5,
    inputVehicleMaxSpeed: 6,
    inputVehicleMaxCarryWeight: 7,
    outputResults: 8,
};

const validateFloat = (inputName, input) => {
    return inputValidator.validateFloatInput(inputName, input);
};

const promptStartCommand = (readlineInstance) => {
    consolePrinter.print(
        `Invalid command. Please enter a valid command.`,
        colorCodeEnum.red
    );
    consolePrinter.print(
        'To begin, input the "start" command (without double-quotes) and press the "Enter" or "Return" key.',
        colorCodeEnum.green
    );
    readlineInstance.prompt();
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
        promptStartCommand(readlineInstance);
    }
};

const verifyBaseDeliveryCost = (input, readlineInstance, step, delivery) => {
    const currentInputName = "base delivery cost";
    const validatedDeliveryCost = validateFloat(currentInputName, input);

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
        readlineInstance.prompt();
    } else {
        consolePrinter.print(
            "Please enter a base delivery cost (the flat cost that will be applied to each of the package(s)",
            colorCodeEnum.brightBlue
        );
        readlineInstance.prompt();
    }
};

const verifyPackageAmount = (input, readlineInstance, step, delivery) => {
    const currentInputName = "package amount";
    const validatedPackageAmount = validateFloat(currentInputName, input);

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
        readlineInstance.prompt();
    } else {
        consolePrinter.print(
            `Please enter the number of packages:`,
            colorCodeEnum.brightBlue
        );
        readlineInstance.prompt();
    }
};

const verifyPackageDetails = (input, readlineInstance, step, delivery) => {
    // 1 package should have at least 3 details: name, weight, distance
    const minimumPackageDetailsLength = delivery.getPackageAmount() * 3;

    const packageDetails = input.split(" ");
    if (packageDetails.length >= minimumPackageDetailsLength) {
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
        step.value = processEnum.inputProcessFlow;
        readlineInstance.prompt();
    } else {
        consolePrinter.print(
            "Please enter the package details in the following format: 'package name', 'weight', 'distance', 'offer code(s)'.",
            colorCodeEnum.brightBlue
        );
        consolePrinter.print(
            "For example: 'PKG1 5 5 OFR001 PKG2 15 5 OFR002 PKG3 10 100 OFR003'.",
            colorCodeEnum.green
        );
        readlineInstance.prompt();
    }
};

const verifyProcessFlow = (input, readlineInstance, step, delivery) => {
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
        readlineInstance.prompt();
    } else if (input === "add") {
        consolePrinter.print(
            `Please enter the number of vehicles:`,
            colorCodeEnum.brightBlue
        );
        step.value = processEnum.inputVehicleAmount;
        readlineInstance.prompt();
    } else if (input === "quit") {
        consolePrinter.print(
            `Shutting down the application.`,
            colorCodeEnum.red
        );
        readlineInstance.close();
    } else {
        consolePrinter.print(
            "Enter 'cost' to calculate the cost or 'add' to include vehicle information and estimate both cost and time.",
            colorCodeEnum.brightBlue
        );
        readlineInstance.prompt();
    }
};

const verifyVehicleAmount = (input, readlineInstance, step, delivery) => {
    const currentInputName = "vehicle amount";
    const validatedVehicleAmount = validateFloat(currentInputName, input);

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
        step.value = processEnum.inputVehicleMaxSpeed;
        readlineInstance.prompt();
    } else {
        consolePrinter.print(
            `Please enter the number of vehicles:`,
            colorCodeEnum.brightBlue
        );
        readlineInstance.prompt();
    }
};

const VerifyVehicleMaxSpeed = (input, readlineInstance, step, delivery) => {
    const currentInputName = "vehicle max speed";
    const validatedVehicleMaxSpeed = validateFloat(currentInputName, input);

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
        step.value = processEnum.inputVehicleMaxCarryWeight;
        readlineInstance.prompt();
    } else {
        consolePrinter.print(
            `Please enter the vehicle max speed.`,
            colorCodeEnum.brightBlue
        );
        readlineInstance.prompt();
    }
};

const verifyVehicleMaxCarryWeight = (
    input,
    readlineInstance,
    step,
    delivery
) => {
    const currentInputName = "vehicle max carry weight";
    const validatedMaxCarryWeight = validateFloat(currentInputName, input);

    if (
        typeof validatedMaxCarryWeight !== "string" &&
        delivery.validateWeightWithPackages(validatedMaxCarryWeight)
    ) {
        delivery.setVehicleMaxCarryWeight(validatedMaxCarryWeight);
        consolePrinter.print(
            `The ${currentInputName} is ${delivery.getVehicleMaxCarryWeight()}.`,
            colorCodeEnum.green
        );

        consolePrinter.print(
            `Start delivering packages by entering "deliver"!`,
            colorCodeEnum.magenta
        );

        step.value = processEnum.outputResults;
        readlineInstance.prompt();
    } else {
        consolePrinter.print(
            `Please enter the vehicle max carry weight. The heaviest package has weight ${delivery.getHeaviestPackageWeight()}`,
            colorCodeEnum.brightBlue
        );
        readlineInstance.prompt();
    }
};

const outputResults = (input, readlineInstance, step, delivery) => {
    if (input === "deliver") {
        delivery.computeDeliveredPackages();
        delivery.outputPackage();
        readlineInstance.close();
    } else {
        consolePrinter.print(
            `Invalid command. Please enter a valid command.`,
            colorCodeEnum.red
        );
        consolePrinter.print(
            `Start delivering packages by entering "deliver"!`,
            colorCodeEnum.green
        );
        readlineInstance.prompt();
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
    const step = { value: 0 };

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    rl.on("line", async (line) => {
        const input = line.trim();
        switch (step.value) {
            case processEnum.inputStartCommand:
                verifyStartCommand(input, rl, step);
                break;

            case processEnum.inputBaseDeliveryCost:
                verifyBaseDeliveryCost(input, rl, step, mainDelivery);
                break;

            case processEnum.inputPackageAmount:
                verifyPackageAmount(input, rl, step, mainDelivery);
                break;

            case processEnum.inputPackageDetails:
                verifyPackageDetails(input, rl, step, mainDelivery);
                break;

            case processEnum.inputProcessFlow:
                verifyProcessFlow(input, rl, step, mainDelivery);
                break;

            case processEnum.inputVehicleAmount:
                verifyVehicleAmount(input, rl, step, mainDelivery);
                break;

            case processEnum.inputVehicleMaxSpeed:
                VerifyVehicleMaxSpeed(input, rl, step, mainDelivery);
                break;

            case processEnum.inputVehicleMaxCarryWeight:
                verifyVehicleMaxCarryWeight(input, rl, step, mainDelivery);
                break;

            case processEnum.outputResults:
                outputResults(input, rl, step, mainDelivery);
                break;
        }
    });

    rl.prompt();
} catch (error) {
    consolePrinter.print(error, colorCodeEnum.red);
}

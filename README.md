# AP IMPORT

## v1.0.0

## apImport

### Usage

#### apImport takes 4 parameters

#### - items: Array = default array of items

#### - batchSize: Integer > 1 = the number of elements in each batch

#### - options: Object = 3 options

- <b>stopOnFail</b> <default: true> = determine whether to throw an error and stop the importing or to go on and retain the "bad" items in an array
- <b>stopOnFailErr</b> <default: "defaultErrorHandler"> = set the callback function that will handle the error in case stopOnFail is set to true. This callback function is called using 3 parameters: 
<ol>
<li>err: error message that is thrown </li>
<li>index: the index of the item that failed</li>
<li>item: the actual item that failed</li>
</ol>

```javascript
// This is the default for stopOnFailErr
const defaultErrorHandler = (err, index, item) => {
  return (
    "Whoops... Something went wrong while importing. Here is the error: \n" +
    err +
    "\n" +
    "This error happened while importing this product: \n" +
    `items[${index}] => ${item}`
  );
};
```

- <b>continueOnFailErr</b> <default: 5> = set the callback function that will handle the error in case stopOnFail is set to false. This callback function is called using 1 parameter: 

<ol>
<li>array of faulted items' indexes</li>
</ol>

```javascript
// This is the default for continueOnFailErr
const defaultContinueErrorHandler = (arrayOfItems) => {
  console.log(
    "There were some products that didn't quite make the cut. Here is an array of indexes:",
    arrayOfItems
  );
};
```

#### - resolveCallback: Function = callback function with 1 parameter that returns a string(optional) and handles the product importing. This function will need to throw and error to enable the <b>rejectCallback</b>

#### - rejectCallback: Function = callback function with 2 parameters that returns a string(error message) and handles the product importing failure. This function is called using 2 parameters:

- err: error message
- item: the failed item


### Examples

```Javascript
    import { apImport } from "ap-import";

    let databaseLMAO = [];

    const items = [30, 10, 20, 30, 40, 50, 60];

    await apImport(
        items,
        {
        stopOnFail: false,
        },
        async (item) => {
        if (item % 3 === 0) {
            databaseLMAO.push(item);
            return true;
        } else {
            // need to throw an error to access the rejectCallback
            throw new Error();
        }
        },
        async (err, _) => {
            return "custom err";
        }
    );

    // There were some products that didn't quite make the cut. Here is an array of indexes: [ 1, 2, 4, 5 ]
    console.log(databaseLMAO);
    // [30, 30, 60]
    databaseLMAO = [];

    try {
    await apImport(
    items,
    {
        stopOnFail: true,
    },
    async (item) => {
        if (item % 3 === 0) {
            databaseLMAO.push(item);
            return true;
        } else {
        // need to throw an error to access the rejectCallback
            throw new Error();
        }
    },
    async (err, _) => {
        return "custom err";
    }
    );
    } catch(err) {
        // try-catch method is done so you can see that the items that din't throw an error were corectly handled
        // without the try-catch block around the function (with stopOnFail: true) the application would have stopped on the error
        console.log(databaseLMAO);
        // [30]
        throw new Error(err);
        /*
        Error: Error: Whoops... Something went wrong while importing. Here is the error:
        custom err
        This error happened while importing this product:
        items[1] => 10
        */
    }
```

const defaultErrorHandler = (err, index, item) => {
  return (
    "Whoops... Something went wrong while importing. Here is the error: \n" +
    err +
    "\n" +
    "This error happened while importing this product: \n" +
    `items[${index}] => ${item}`
  );
};

const defaultContinueErrorHandler = (arrayOfItems) => {
  console.log(
    "There were some products that didn't quite make the cut. Here is an array of indexes:",
    arrayOfItems
  );
};

const defaultOptions = {
  stopOnFail: true,
  stopOnFailErr: defaultErrorHandler,
  continueOnFailErr: defaultContinueErrorHandler,
};

export async function apImport(_items, options, resolveCB, rejectCB) {
  if (!Array.isArray(_items))
    throw new TypeError("First parameter must be an array");

  options = { ...defaultOptions, ...options };

  const items = [..._items];
  const faultProducts = [];
  let now = 0;

  for (const item of items) {
    const a = async () => {
      try {
        const temp = await resolveCB(item);
        return {
          success: true,
          msg: temp,
        };
      } catch (err) {
        return {
          success: false,
          msg: await rejectCB(err, item),
        };
      }
    };

    let x = await a();

    if (!x.success) {
      let err = x.msg;
      if (options.stopOnFail) {
        throw new Error(options.stopOnFailErr(err, now, items[now]));
      } else {
        faultProducts.push(now);
      }
    }
    now++;
  }

  if (!options.stopOnFail && faultProducts.length) {
    options.continueOnFailErr(faultProducts);
  }
}

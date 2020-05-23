export default (importPromise, isController, canReturnDefault = true) => {
  return importPromise
    .then(exp => {
      if (exp.default) {
        if (isController) {
          return exp.default()
        } else if (canReturnDefault) {
          return exp.default
        }
      }
      return exp
    })
    .catch(console.error)
}

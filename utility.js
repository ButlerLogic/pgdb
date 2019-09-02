module.exports = {
  public (value) {
    return {
      enumerable: true,
      writable: true,
      configurable: true,
      value
    }
  },

  private (value) {
    return {
      enumerable: false,
      writable: true,
      configurable: true,
      value
    }
  },

  const (value) {
    return {
      enumerable: true,
      writable: false,
      configurable: false,
      value
    }
  },

  privateconst (value) {
    return {
      enumerable: false,
      writable: false,
      configurable: false,
      value
    }
  }
}

# minmax

This is a calculator that I made to easily calculate the minimum and maximum expense when a promotion includes a maximum discount value. Take this example:

- **Minimum expense**: 150.000
- **Discount percentage**: 30%
- **Maximum discount value**: 80.000

There is a "saturation point", where if we increase our expense, the discount value would still be 80.000. This is not really efficient (at least for me). If I am using a promotion, I want to stretch the discount as wide as I can, as long as it doesn't hurt my wallet.

Also, take another example:

- **Minimum expense**: 40.000
- **Discount percentage**: 35%
- **Maximum discount value**: 25000

Let's say that, you have 29.000 of expense in your cart. Let's try inputting the above data to this calculator.

| Harga Awal (Rp) | Diskon (Rp) | Harga Akhir (Rp) |
| --------------- | ----------- | ---------------- |
| 40.000          | 14.000      | 26.000           |
| 50.000          | 17.500      | 32.500           |
| 60.000          | 21.000      | 39.000           |
| 70.000          | 24.500      | 45.500           |
| 71.428          | 24.999      | 46.429           |

Using the above table, we know that, if we add 11.000 more expense, we can save 3.000 at the end, quite literally! Well, of course, the "best save" would be not buying anything at all. But, yeah, you get the point.

## Development

### Prerequisites

1. [Yarn](https://yarnpkg.com/) Classic (v1)
2. [Node.js®](https://nodejs.org/) LTS (at least v14)

After that, on root project, do this to install the dependencies:

```bash
yarn
```

### Running the server

```bash
# Generate the Tailwind CSS using JIT mode.
yarn css:generate
# Run the server, which opens on port 3000.
yarn dev
```

Then, go to http://localhost:3000 to see the UI. You can update the functionality right away in the [`index.html`](src/index.html).

## License

MIT

[Take a look of deployed app here](https://bnsmarket-demo.herokuapp.com/)

To start server please run following code in command line under this directory
```
npm install
node server.js
```
Then open an browser, Go to `http://localhost:3000/` to see our web app.

We expect user to input the name of an item. Then user can know immediately the minimum each price for the item at first glance.

A typical listing on market looks like this:
```
{
  "price": 444440,
  "count": 10,
  "each": 44444
}
```

In this occasion, users are not allowed to buy only quantities not equal to 10 out of that listing. Therefore, user can choose to show all listings and if there is a item of desired price and quantity. User can log in the game and buy that listing.

All the name of tradable items are in [this API](https://api.silveress.ie/bns/v3/items)

Some example of tradable items are:

`[Soulstone, Moonstone, Alley Cat, Storm Essence, Transformation Stone, 5 Soulstone Bundle]`

If user is intersted in buying an item but too expensive or too rare on marketplace. They can add the item to their favorite list or set a price alert that with desired price and get notified if someone listed the item with price below that threshold.

Numeric price are converted to gold silver copper.
```
convert numeric price to gold silver copper
100 copper = 1 silver
100 silver = 1 gold
example: 123456 = 12g34s56c
```

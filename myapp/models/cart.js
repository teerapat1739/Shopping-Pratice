module.exports = function Cart(oldCart) {
//Initail ตัวแปร เริ่มต้น โดยมีการdeclare  แบบ boolean เพราะ บางทีค่าที่รับมาเป็นempty เลยต้อง ใช้หรือ มาช่วย
//ไม่เช่นนั้นจะทำให้เกิด error

    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
  //Check if ว่า ว่างหรือเปล่าถ้าว่างก็ทำการประกาศตัวแปรที่จะ declare ใน if
//ถ้ามีแล้วก็ทำการเพิ่ม ยอดการ stored
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.reduceByOne = function(id) {
          this.items[id].qty--;
          this.items[id].price -= this.items[id].item.price;
          this.totalQty--;
          this.totalPrice -= this.items[id].item.price;

          if (this.items[id].qty <= 0) {
              delete this.items[id];
          }
      };

      this.removeItem = function(id) {
          this.totalQty -= this.items[id].qty;
          this.totalPrice -= this.items[id].price;
          delete this.items[id];
      };
//Push ข้อมูลลงใน arr

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};

import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import PropTypes from "prop-types";

UserCartItemsContent.propTypes = {
  cartItem: PropTypes.object.isRequired,
};

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(cartItem, actionType) {
    if (!cartItems?.items || !Array.isArray(cartItems.items) || !productList || !Array.isArray(productList)) {
      toast({
        title: "Cart or product data is missing.",
        variant: "destructive",
      });
      return;
    }

    const cartItemsList = cartItems.items;

    if (actionType === "plus") {
      const cartItemIndex = cartItemsList.findIndex(
        (item) => item.productId === cartItem?.productId
      );
      const productIndex = productList.findIndex(
        (product) => product._id === cartItem?.productId
      );

      if (productIndex === -1) {
        toast({
          title: "Product not found in inventory.",
          variant: "destructive",
        });
        return;
      }

      const totalStock = productList[productIndex].totalStock;

      if (cartItemIndex > -1) {
        const currentQuantity = cartItemsList[cartItemIndex].quantity;
        if (currentQuantity + 1 > totalStock) {
          toast({
            title: `Only ${totalStock} in stock. Cannot add more to cart.`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    const newQuantity =
      actionType === "plus"
        ? cartItem?.quantity + 1
        : cartItem?.quantity - 1;

    if (newQuantity < 1) {
      toast({
        title: "Quantity cannot be less than 1.",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: cartItem?.productId,
        quantity: newQuantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated successfully.",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;

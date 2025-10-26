import { redirect } from "next/navigation";
import authService from "./auth-service";

class RoutingService {
  /**
   * If the user is authorized, redirects them to the stocks calculator page.
   * @remarks
   * Side effect: may trigger a navigation redirect which can interrupt the current flow.
   */
  async authorizedRedirection() {
    if (await authService.isLoggedIn()) {
      redirect("/admin/stocks-calculator");
    }
  }

  /**
   * If the user is not authorized, redirects them to the login page.
   * @remarks
   * Side effect: may trigger a navigation redirect which can interrupt the current flow.
   */
  async unauthorizedRedirection() {
    if (!(await authService.isLoggedIn())) {
      redirect("/admin/login");
    }
  }
}

const routingService = new RoutingService();

export default routingService;

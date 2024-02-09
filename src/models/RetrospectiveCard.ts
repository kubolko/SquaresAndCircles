interface RetrospectiveCard {
  id: string;
  x: number;
  y: number;
  z: number;
  title: string;
  text: string;
  color: string;
  height: number;
  width: number;
  isCurrentlyDragged: boolean;
  topZ: number;
  bottomZ: number;
}

export { RetrospectiveCard };

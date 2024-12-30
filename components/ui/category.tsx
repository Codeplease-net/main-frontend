import { Badge } from "./badge";

export default function CategoryBadge({category}: {category: string}){
  return <>{category
        .split(",")
        .map(s => s.replaceAll(" ", ""))
        .filter(value => value.length > 0)
        .sort()
        .map(content => (
          <Badge variant="outline">{content}</Badge>
        ))}</>
}
export function Card({ children, className = '', onClick, hover = false, style = {} }) {
  const hoverClass = hover ? 'hover:shadow-lg cursor-pointer transition-shadow' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 ${hoverClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
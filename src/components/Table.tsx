import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { Config } from "datatables.net-dt";
import { RefObject, useEffect, useRef } from "react";

export default function Table({ config }: { config: Config }) {
  const _table = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    if (_table.current) {
      const table = $(_table.current).DataTable(config);

      return () => {
        table.destroy();
      };
    }
  }, [config]);

  return (
    <table ref={_table as RefObject<HTMLTableElement>} className="display" />
  );
}

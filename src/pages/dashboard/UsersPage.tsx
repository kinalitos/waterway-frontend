import { Calendar, Edit, Eye, Filter, Mail, MapPin, Plus, Search, Trash2, UserCog } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { deleteUser, getUsers } from "@/services/users-api.js"
import { useDebouncedCallback } from 'use-debounce'
import { User } from "@/services/types.js";
import { cn } from "@/lib/utils.js";
import { PaginatedTable } from "@/components/ui/paginated-table.js"

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // query params usage
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const roleFilter = searchParams.get("role") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const PAGE_SIZE = 10;
  const totalPages = useRef<number>(0)


  const fetchUsers = (query: string) => {
    setIsLoading(true);
    getUsers({ q: query, page, pageSize: PAGE_SIZE, ...(roleFilter !== "all" && { role: roleFilter }) })
      .then((response) => {
        if ('error' in response) {
          return;
        }

        const users = response.results;
        setUsers(users);
        totalPages.current = response.totalPages;
      })
      .catch(() =>
        toast.error("No se pudieron cargar los usuarios. Intente nuevamente.")
      )
      .finally(() => setIsLoading(false));

  }

  const handleSearch = (newQuery: string) => {
    setSearchParams({
      q: newQuery,
      role: roleFilter,
      page: "1", // reset to first page
    });
  };

  const handleRoleChange = (newRole: string) => {
    setSearchParams({
      q: query,
      role: newRole,
      page: "1",
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      q: query,
      role: roleFilter,
      page: newPage.toString(),
    });
  };


  const debounced = useDebouncedCallback(
    fetchUsers,
    600
  )

  useEffect(() => {
    debounced(query)
  }, [query]);

  useEffect(() => {
    if (isLoading) return;
    fetchUsers(query)
  }, [roleFilter, page]);

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id)
      setUsers(users.filter((user) => user.id !== id))
      toast.success("Evento eliminado", {
        description: "El usuario ha sido eliminado correctamente.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Error", {
        description: "No se pudo eliminar el usuario. Intente nuevamente.",
      })
    }
  }

  // Determinar si el usuario puede editar o eliminar un usuario
  const canManageEvent = (user) => {
    return user?.role === "administrador" || user?.role === "moderador" || user.created_by === user?.id
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1
            className="text-3xl font-bold tracking-tight text-[#282f33] bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] bg-clip-text text-transparent">
            Usuarios
          </h1>
          <p className="text-[#435761] max-w-2xl">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque est nesciunt obcaecati quibusdam quos, vel?
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-[#2ba4e0] to-[#418fb6] hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          asChild
        >
          <Link to="/dashboard/users/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4"/>
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <div
        className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-[#418fb6]/10">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#435761]"/>
            <Input
              placeholder="Buscar usuarios..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-[#435761]"/>
          <Select value={roleFilter} onValueChange={(e) => handleRoleChange(e)}>
            <SelectTrigger className="w-[180px] border-[#418fb6]/30 focus:border-[#2ba4e0] transition-all">
              <SelectValue placeholder="Filtrar por estado"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="usuario">Usuario</SelectItem>
              <SelectItem value="moderador">Moderadores</SelectItem>
              <SelectItem value="administrador">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <PaginatedTable
        columns={[
          { label: 'Nombre' },
          { label: 'Email' },
          { label: 'Role' },
          { label: 'Acciones' },
        ]}
        data={users}
        isLoading={isLoading}
        emptyState={
          <div className="flex flex-col items-center justify-center py-8 text-[#435761]">
            <Calendar className="h-12 w-12 text-[#2ba4e0]/40 mb-2"/>
            <p className="font-medium">No se encontraron Usuarios</p>
            <p className="text-sm text-[#435761]/70">Intenta con otros filtros o crea un nuevo usuario</p>
          </div>
        }
        renderRow={(user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell className="flex gap-2 items-end">
              <Mail className="inline h-3.5 w-3.5 text-[#2ba4e0]"/>
              <span>{user.email}</span>
            </TableCell>
            <TableCell>
              <RoleBadge variant={user.role}>{user.role}</RoleBadge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/dashboard/users/${user._id}`}>
                      <Eye className="mr-2 h-4 w-4"/>
                      <span>Ver detalles</span>
                    </Link>
                  </DropdownMenuItem>
                  {//canManageEvent(user) && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to={`/dashboard/users/edit/${user._id}`}>
                          <Edit className="mr-2 h-4 w-4"/>
                          <span>Editar</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteUser(user._id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4"/>
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </>
                    /* )*/
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
        pagination={{
          page: page,
          totalPages: totalPages.current,
          onPageChange: handlePageChange,
        }}
      />

    </div>
  )
}

function RoleBadge({ variant, children }) {
  let variantClasses = ""
  switch (variant) {
    case "administrador":
      variantClasses = "bg-red-500/20 text-black"
      break
    case "moderador":
      variantClasses = "bg-blue-500/20 text-black"
      break
    case "usuario":
      variantClasses = "bg-purple-500/20 text-black"
      break
    default:
      variantClasses = "bg-gray-500/20 text-black"
  }

  return (
    <Badge className={cn(
      // "rounded-full px-2 py-1 text-xs font-medium",
      variantClasses,
      // "bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 ease-in-out",
      // { "cursor-pointer": variant !== "usuario" } // Cambia el cursor solo si no es 'usuario'
    )}>
      <UserCog className="mr-1.5 h-3.5 w-3.5 text-[#2ba4e0]"/>
      <span>{children}</span>
    </Badge>
  )
}